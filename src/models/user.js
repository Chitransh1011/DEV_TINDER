const mongoose = require('mongoose');

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
            lowercase:true
        },
        password:{
            type: String,
            trim:true,
            required:true,
            minLength:8
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

const User = mongoose.model("User",userSchema);
module.exports = User;