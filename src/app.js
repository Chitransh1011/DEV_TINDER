const express = require("express");
const PORT = 3000;
const app = express();
const {adminAuth,userAuth} = require('./middlewares/auth');

app.use("/admin",adminAuth);

app.get("/user/data",userAuth,(req,res)=>{
    res.send("User Data sent");
})
app.get("/admin/getAllData",(req,res)=>{
    res.send("All data sent");
})

app.listen(PORT,()=>{
    console.log(`Server started on PORT : ${PORT}`);
})