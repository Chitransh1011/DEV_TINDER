const express = require("express");
const connectDB = require("./config/database");
const { PORT } = require("./config/serverConfig");
const { adminAuth, userAuth } = require("./middlewares/auth");
const User = require("./models/user");
const app = express();

app.use(express.json());
app.post("/signup", async (req, res) => {
  try {
    const data = req.body;
    const email = data?.emailId;
    const password = data?.password;
    if(!email || !password){
        res.status(404).send("Email and Password is required");
    }
    const user = new User(req.body);
    await user.save();
    res.send("User signuped successfully");
  } catch (error) {
    console.error(error.message);
  }
});
app.get("/user", async (req, res) => {
  try {
    const user = await User.find({ emailId: req.body.emailId });
    if (user.length === 0) {
      res.status(404).send("404 Not Found");
    }
    res.send(user);
  } catch (error) {
    res.status(400).send("Something went wrong");
  }
});
app.get("/userbyId", async (req, res) => {
  try {
    const user = await User.findById(req.body._id);
    if (user.length === 0) {
      res.status(404).send("404 Not Found");
    }
    res.send(user);
  } catch (error) {
    res.status(400).send("Something went wrong");
  }
});
app.get("/feed", async (req, res) => {
  try {
    const user = await User.find({});
    res.send(user);
  } catch (error) {
    res.status(400).send("Something went wrong");
  }
});

app.delete("/user", async (req, res) => {
  try {
    const userId = req.body.userId;
    // console.log(userId)
    const user = await User.findByIdAndDelete(userId);
    res.send(user);
  } catch (error) {
    res.status(400).send("Something went wrong");
  }
});
app.patch("/user/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const data = req.body;

    const allowedUpdates = [
        "age","gender","firstName","lastName"
    ];
    const isUpdatedAllowed = Object.keys(data).every((k)=>allowedUpdates.includes(k));
    if(!isUpdatedAllowed){
        throw new Error("Update Not allowed");
    }
    const user = await User.findByIdAndUpdate(userId,data,{
        new:true,
        runValidators:true
    });
    res.send(user);
  } catch (error) {
    res.status(400).send(error.message);
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
