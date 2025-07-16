const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt')
const {JWT_SECRET} = require('../config/serverConfig')
const userSchema = new mongoose.Schema(
    {
        firstName:{
            type: String,
            required:true,
            minLength:1,
            maxLength:50
        },
        lastName:{
            type: String
        },
        emailId:{
            type: String,
            required:true,
            unique:true,
            trim:true,
            lowercase:true,
            validate(value){
                if(!validator.isEmail(value)){
                    throw new Error("Invalid Email : "+value);
                }
            }
        },
        password:{
            type: String,
            trim:true,
            required:true,
            minLength:8,
            validate(value){
                if(!validator.isStrongPassword(value)){
                    throw new Error("Need a strong password");
                }
            }
        },
        age:{
            type: Number,
            required:true,
            min:18
        },
        gender:{
            type: String,
            required:true,
            lowercase:true,
            validate(value){
                if(!["male","female","others"].includes(value)){
                    throw new Error("Gender is not valid");
                }
            }
        },
    },
    {
        timestamps:true
    }
);
userSchema.methods.getJWT = async function(){
    const token  = await jwt.sign({_id:this._id},JWT_SECRET,{expiresIn:'1h'});
    return token;
}
userSchema.methods.validatePassword = async function(passbyUser){
    const isPassword = await bcrypt.compare(passbyUser,this.password)//this.password ye db se aayega joh ki hash form mai stored rheta
    return isPassword;
}
const User = mongoose.model("User",userSchema);

module.exports = User;