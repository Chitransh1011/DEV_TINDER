const express = require("express");
const connectDB = require("./config/database");
const { PORT } = require("./config/serverConfig");
const { adminAuth, userAuth } = require("./middlewares/auth");
const User = require("./models/user");
const app = express();

// DUMMY DATA
const data = {
  firstName: "Virat",
  lastName: "Kohli",
  emailId: "virat@gmail.com",
  password: "virat@123",
  age: 35,
  gender: "Male",
};
app.post("/signup", async (req, res) => {
  try {
    const user = new User(data);
    await user.save();
    res.send("User signuped successfully");
  } catch (error) {
    console.error(error);
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
