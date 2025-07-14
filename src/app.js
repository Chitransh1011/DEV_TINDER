const express = require("express");
const PORT = 3000;
const app = express();

app.use((req,res)=>{
    res.send("Hi From the server");
})
app.listen(PORT,()=>{
    console.log(`Server started on PORT : ${PORT}`);
})