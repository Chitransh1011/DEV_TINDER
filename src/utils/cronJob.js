const {subDays,startOfDay,endOfDay} = require('date-fns');
const connectionModel = require("../models/connectionrequest");
const cron = require('node-cron');
const sendEmail = require('./sendEmail');
const { FROM_EMAIL } = require('../config/serverConfig');

cron.schedule("26 16 * * *",async ()=>{
    try {
        const yesterday = subDays(new Date(),0);
        const yesterdayStart = startOfDay(yesterday);
        const yesterdayEnd = endOfDay(yesterday);
        const pendingReq = await connectionModel.find({
            status:"interested",
            createdAt:{
                $gte:yesterdayStart,
                $lt:yesterdayEnd
            }
        }).populate("fromUserId toUserId");
        const listofEmails = [... new Set(pendingReq.map(req=>req.toUserId.emailId))];
        for(const email of listofEmails){
            try {
                await sendEmail(FROM_EMAIL,"Request send successfully",`Hi ${email} Request is send`);
            } catch (error) {
                console.error(error);
            }
        }
    } catch (error) {
        console.error(error.message)
    }
})