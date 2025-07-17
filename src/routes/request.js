const express = require("express");
const { userAuth } = require("../middlewares/auth");
const User = require("../models/user");
const connectionModel = require("../models/connectionrequest");
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
          { fromUserId:toUserId, toUserId:fromUserId },
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
module.exports = requestRouter;
