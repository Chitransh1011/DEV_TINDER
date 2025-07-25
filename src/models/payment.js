const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Types.ObjectId,
        ref:"User",
        required:true
    },
    paymentId:{
        type:  String
    },
    orderId:{
        type:String,
        required:true
    },
    status:{
        type:String,
        required:true
    },
    amount:{
        type:Number,
        required:true
    },
    currency:{
        type:String,
        required:true
    },
    notes:{
        firstName:{
            type:String
        },
        lastName:{
            type:String
        },
        email:{
            type:String
        },
        membershipType:{
            type:String
        },
    }
},{timestamps:true});

const Payment = new mongoose.model("Payment",paymentSchema);
module.exports = Payment;