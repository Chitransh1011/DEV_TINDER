const express = require("express");
const { userAuth } = require("../middlewares/auth");
const User = require("../models/user");
const { validationEditProfile } = require("../utils/validation");
const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  const user = req.user;
  res.send(user);
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validationEditProfile(req)) {
      throw new Error("Invalid Edit Input");
    }
    const user = req.user;
    Object.keys(req.body).forEach((key) => (user[key] = req.body[key]));
    await user.save();
    res.json({
      message: `${user.firstName} is updated successfully`,
      data: user,
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
});
module.exports = profileRouter;
