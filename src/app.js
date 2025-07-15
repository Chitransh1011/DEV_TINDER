const express = require("express");
const connectDB = require("./config/database");
const { PORT } = require("./config/serverConfig");
const { adminAuth, userAuth } = require("./middlewares/auth");
const User = require("./models/user");
const app = express();

app.use(express.json());
app.post("/signup", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.send("User signuped successfully");
  } catch (error) {
    console.error(error);
  }
});
app.get("/user",async (req,res)=>{
    try {
        const user = await User.find({emailId:req.body.emailId});
        if(user.length === 0){
            res.status(404).send("404 Not Found");
        }
        res.send(user);
    } catch (error) {
        res.status(400).send("Something went wrong");
    }
});
app.get("/feed",async (req,res)=>{
    try {
        const user = await User.find({});
        res.send(user);
    } catch (error) {
        res.status(400).send("Something went wrong");
    }
});

connectDB()
  .then(() => {
    console.log("Database connected successfully");
    app.listen(PORT, () => {
      console.log(`Server started on PORT : ${PORT}`);
    });
  })
  .catch(() => {
    console.error("Database not connected");
  });
