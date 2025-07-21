const express = require("express");
const { userAuth } = require("../middlewares/auth");
const connectionModel = require("../models/connectionrequest");
const User = require("../models/user");

const userRouter = express.Router();

userRouter.get("/user/requests/recieved", userAuth, async (req, res) => {
  try {
    const loggedIn = req.user;

    const allRequest = await connectionModel
      .find({
        toUserId: loggedIn._id,
        status: "interested",
      })
      .populate("fromUserId", [
        "firstName",
        "lastName",
        "age",
        "gender",
        "photoUrl",
        "about",
        "skills",
      ]);

    res.json({
      message: "Details of Pending Request",
      data: allRequest,
    });
  } catch (error) {
    res.send(error.message);
  }
});
userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedIn = req.user;
    const connectionReq = await connectionModel
      .find({
        $or: [
          { fromUserId: loggedIn._id, status: "accepted" },
          { toUserId: loggedIn._id, status: "accepted" },
        ],
      })
      .populate("fromUserId")
      .populate("toUserId");

    const data = connectionReq.map((row) => {
      if (row.fromUserId._id.equals(loggedIn._id)) {
        return row.toUserId;
      }
      return row.fromUserId;
    });
    res.json({ data });
  } catch (error) {
    res.json({
      message: error.message,
    });
  }
});
userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const hideUsers = new Set();
    const removeUser = await connectionModel.find({
        $or:[
            {fromUserId:req.user._id},
            {toUserId:req.user._id}
        ]
    }).select(["fromUserId","toUserId","-_id"]);
    removeUser.forEach((row) => {
        hideUsers.add(row.fromUserId.toString());
        hideUsers.add(row.toUserId.toString());
    });
    const users = await User.find({
        $and:[
            {_id:{$ne:req.user._id}},
            {_id:{$nin:Array.from(hideUsers)}}
        ]
    })
    res.json({
        data:users
    })
  } catch (error) {
    res.json({
      message: error.message,
    });
  }
});
module.exports = userRouter;
