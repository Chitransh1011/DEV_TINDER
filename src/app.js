const express = require("express");
const PORT = 3000;
const app = express();
app.get("/user",(req,res)=>{
    res.send({firstName:"Chitransh",lastName:"Prasanna"});
})
app.post("/user",(req,res)=>{
    res.send("Successfully pushed in Database");
})
app.delete("/user",(req,res)=>{
    res.send("Successfully deleted from Database");
})

app.listen(PORT,()=>{
    console.log(`Server started on PORT : ${PORT}`);
})