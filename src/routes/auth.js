const express = require('express');
const { validateSignUp } = require("../utils/validation");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  try {
    // Destructing the data
    const { firstName, lastName, emailId, password, age, gender,photoUrl,about,skills } = req.body;

    // Validating the data
    validateSignUp(req);

    // Doing hashing by auto generating salt and applying 10 round on plain password
    const hashpassword = await bcrypt.hash(password, 10);

    // Creating new instance of User model by the data
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: hashpassword,
      age,
      gender,
      photoUrl,
      about,
      skills
    });

    // Saving in DB
    await user.save();
    res.send("User signuped successfully");
  } catch (error) {
    return res.status(400).send(error.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid credentials");
    }
    const isPassword = await user.validatePassword(password);
    
    if (isPassword) {
      const token = await user.getJWT();
      res.cookie('token',token);
      res.send(user);
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (error) {
    res.status(404).send(error.message);
  }
});
authRouter.post("/logout",async(req,res)=>{
    res.cookie('token',null,{
      expires: new Date(Date.now())
    });
    res.send("LogOut Successfully");
})

module.exports = authRouter;