const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('../config/serverConfig')
const User = require('../models/user')
const createError = require('http-errors')
const adminAuth = (req,res,next)=>{
    const token = "xyz";
    const isAdmin = token === "xyz";
    console.log("Auth is checking Admin");
    if(!isAdmin){
        res.send(createError(401, 'Please login to view this page.'));
    }
    else{
        next();
    }
}
const userAuth = async(req,res,next)=>{
   try {
    const {token} = req.cookies;
    if(!token){
        return res.status(401).send("Please Login");
    }
    const isTokenValid = await jwt.verify(token,JWT_SECRET);
    const user = await User.findById(isTokenValid._id);
    req.user = user
    next();
   } catch (error) {
        return res.status(400).send(error.message);
   }
}
module.exports = {
    adminAuth,
    userAuth
}