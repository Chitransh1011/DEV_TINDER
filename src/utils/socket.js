const socket = require("socket.io");
const { formatDistanceToNow, fromUnixTime } = require("date-fns");
const Chat = require("../models/chat");

const intitializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: [
        "http://localhost:5173",
        "https://dev-tinder-ui-kappa.vercel.app",
      ],
    },
  });
  io.on("connection", (socket) => {
    socket.on("joinChat", ({ firstName, userId, totargetUserId }) => {
      const roomId = [userId, totargetUserId].sort().join("_");
      console.log(firstName + " joined : ", roomId);

      socket.join(roomId);
    });
    socket.on(
      "sendMessage",
      async ({ firstName, lastName, userId, totargetUserId, text }) => {
        try {
          const roomId = [userId, totargetUserId].sort().join("_");

          let chat = await Chat.findOne({
            participants: { $all: [userId, totargetUserId] },
          });
          if (!chat) {
            chat = new Chat({
              participants: [userId, totargetUserId],
              messages: [],
            });
          }
          chat.messages.push({
            senderId: userId,
            text,
          });
          await chat.save();
          io.to(roomId).emit("messageRecieved", { firstName, lastName, text });
        } catch (error) {
          return res.status(400).json({
            message: error.message,
          });
        }
      }
    );
    socket.on("disconnect", () => {
      console.log(`User disconnected`);
    });
  });
};
module.exports = intitializeSocket;
