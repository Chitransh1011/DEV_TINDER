const express = require("express");
const { userAuth } = require("../middlewares/auth");
const connectionModel = require("../models/connectionrequest");

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

      const data = connectionReq.map((row)=>{
        if(row.fromUserId._id.equals(loggedIn._id)){
            return row.toUserId;
        }
        return fromUserId;
      })
    res.json({ data });
  } catch (error) {
    res.json({
      message: error.message,
    });
  }
});

module.exports = userRouter;
