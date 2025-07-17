const mongoose = require("mongoose");

const connectionSchema = new mongoose.Schema({
    fromUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    toUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    status:{
        type:String,
        enum:{
            values:["interested","ignored","accepted","rejected"],
            message:`{VALUE} is not valid`
        },
        required:true
    }
},{
    timestamps:true
});
connectionSchema.pre("save",function(next){
    if(this.fromUserId.equals(this.toUserId)){
        throw new Error("Same Id cannot send request");
    }
    next();
})

const connectionModel = new mongoose.model("connectionrequest",connectionSchema);

module.exports = connectionModel;