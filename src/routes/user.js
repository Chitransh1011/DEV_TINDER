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
      return fromUserId;
    });
    res.json({ data });
  } catch (error) {
    res.json({
      message: error.message,
    });
  }
});
userRouter.get("/user/feed", userAuth, async (req, res) => {
  try {
    const restUser = await User.find();
    // IMP CONCEPT OF ARROW FUNCTION IS THAT WE CAN RETURN OBJECT BY USING () PARENTHESIS NO NEED OF RETURN
    const data = restUser
      .filter((row) => !row._id.equals(req.user._id))
      .map((row) => ({
          firstName: row.firstName,
          lastName: row.lastName,
          age: row.age,
          gender: row.gender,
          photoUrl: row.photoUrl,
          about: row.about,
          skills: row.skills,
      }));
    res.json({
      data,
    });
  } catch (error) {
    res.json({
      message: error.message,
    });
  }
});
module.exports = userRouter;
