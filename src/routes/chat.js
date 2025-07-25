const express = require('express');
const { userAuth } = require('../middlewares/auth');
const Chat = require('../models/chat');

const chatRouter = express.Router();

chatRouter.get("/chat/:totargetUserId",userAuth,async(req,res)=>{
    const {totargetUserId} = req.params;
    const userId = req.user._id;
    try {
        let chat = await Chat.findOne({
            participants:{$all:[userId,totargetUserId]}
        }).populate({
            path:"messages.senderId",
            select:"firstName lastName"
        });
        if(!chat){
            chat = new Chat({
                participants:[userId,totargetUserId],
                messages:[]
            })
            await chat.save();
        }
        res.json(chat);
    } catch (error) {
        res.status(400).json({
            message:error.message
        })
    }
})


module.exports = chatRouter;