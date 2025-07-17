const express = require('express');
const {  userAuth } = require("../middlewares/auth");
const User = require("../models/user");
const profileRouter = express.Router();

profileRouter.get("/profile",userAuth,async(req,res)=>{
    const user = req.user;
    res.send(user);
});

module.exports = profileRouter;