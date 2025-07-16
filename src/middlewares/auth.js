const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('../config/serverConfig')
const User = require('../models/user')
const adminAuth = (req,res,next)=>{
    const token = "xyz";
    const isAdmin = token === "xyz";
    console.log("Auth is checking Admin");
    if(!isAdmin){
        res.status(401).send("Unauthorized Access");
    }
    else{
        next();
    }
}
const userAuth = async(req,res,next)=>{
   try {
    const {token} = req.cookies;
    if(!token){
        throw new Error("Token is not valid");
    }
    const isTokenValid = await jwt.verify(token,JWT_SECRET);
    const user = await User.findById(isTokenValid._id);
    req.user = user
    next();
   } catch (error) {
        res.status(400).send(error.message);
   }
}
module.exports = {
    adminAuth,
    userAuth
}