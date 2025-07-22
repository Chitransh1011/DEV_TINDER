const express = require("express");
const { userAuth } = require("../middlewares/auth");
const User = require("../models/user");
const connectionModel = require("../models/connectionrequest");
const sendEmail = require("../utils/sendEmail");
const { FROM_EMAIL } = require("../config/serverConfig");
const requestRouter = express.Router();

requestRouter.post(
  "/request/send/:status/:userId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.userId;
      const status = req.params.status;
      const isStatusAllowed = ["interested", "ignored"];
      if (!isStatusAllowed.includes(status)) {
        return res.status(400).send("Invalid Status");
      }
      const userInDb = await User.findById(toUserId);
      if (!userInDb) {
        return res.status(400).send("Invalid ID");
      }

      const existConnection = await connectionModel.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });
      if (existConnection) {
        return res.status(400).send("Connection already exists");
      }
      const connection = await new connectionModel({
        fromUserId,
        toUserId,
        status,
      });
      const data = await connection.save();

      // TO SEND MAIL
      await sendEmail(FROM_EMAIL,"Request Send Successfully",`Hi ${req.user.firstName}, your Request is Send.`)
      res.json({
        status: 200,
        message: "Connection send successfully",
        data: data,
      });
    } catch (err) {
      res.json({
        message: err.message,
      });
    }
  }
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedIn = req.user;
      const isAllowedStatus = ["accepted", "rejected"];
      const { status, requestId } = req.params;
      if (!isAllowedStatus.includes(status)) {
        res.status(400).json({ message: "Status is not valid" });
      }
      const connectionReq = await connectionModel.findOne({
        _id: requestId,
        toUserId: loggedIn._id,
        status: "interested",
      });
      if (!connectionReq) {
        res.status(400).json({ message: "Connection is not valid" });
      }
      connectionReq.status = status;
      const data = await connectionReq.save();
      res.json({ message: "Connection is : " + status, data });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);
module.exports = requestRouter;
