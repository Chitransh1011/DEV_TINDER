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
        "isPremium"
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
    // Query params are intentionally bounded so a client cannot request an
    // unbounded number of profiles in one call.
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), 50);
    const skip = (page - 1) * limit;
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
    const filter = {
        $and:[
            {_id:{$ne:req.user._id}},
            {_id:{$nin:Array.from(hideUsers)}}
        ]
    };
    const [users, total] = await Promise.all([
      User.find(filter)
        .select("firstName lastName age gender photoUrl about skills isPremium membershipType")
        .sort({ createdAt: -1, _id: -1 })
        .skip(skip)
        .limit(limit),
      User.countDocuments(filter),
    ]);

    res.json({
      data: users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNextPage: skip + users.length < total,
        hasPreviousPage: page > 1,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});
module.exports = userRouter;
