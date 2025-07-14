const express = require("express");
const PORT = 3000;
const app = express();
app.use("/routes",(req,res,next)=>{
    console.log("Route Handler 1");
    next();
},(req,res,next)=>{
    console.log("Route Handler 2");
    res.send("Route Handler 2");
})


app.listen(PORT,()=>{
    console.log(`Server started on PORT : ${PORT}`);
})