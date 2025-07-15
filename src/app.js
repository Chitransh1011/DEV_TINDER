const express = require("express");
const connectDB = require("./config/database");
const { PORT } = require("./config/serverConfig");
const bcrypt = require('bcrypt');
const { adminAuth, userAuth } = require("./middlewares/auth");
const User = require("./models/user");
const {validateSignUp} = require('./utils/validation');
const app = express();

app.use(express.json());
app.post("/signup", async (req, res) => {
  try {
    // Destructing the data
    const {firstName,lastName,emailId,password,age,gender} = req.body;

    // Validating the data
    validateSignUp(req);

    // Doing hashing by auto generating salt and applying 10 round on plain password
    const hashpassword = await bcrypt.hash(password,10);
  
    // Creating new instance of User model by the data
    const user = new User({
        firstName,
        lastName,
        emailId,
        password:hashpassword,
        age,
        gender
    });

    // Saving in DB
    await user.save();
    res.send("User signuped successfully");
  } catch (error) {
        // this .errors and .name how you got to know console.log(error to check what are there )and you will se errors->will give Object
      return res.status(400).send(error.message);
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

    const allowedUpdates = ["age", "gender", "firstName", "lastName"];
    const isUpdatedAllowed = Object.keys(data).every((k) =>
      allowedUpdates.includes(k)
    );
    if (!isUpdatedAllowed) {
      throw new Error("Update Not allowed");
    }
    const user = await User.findByIdAndUpdate(userId, data, {
      new: true,
      runValidators: true,
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
