const mongoose = require('mongoose');
const {MONGO_URI} = require('./serverConfig')
const connectDB = async ()=>{
    await mongoose.connect(process.env.MONGO_URI);
}

module.exports = connectDB;