const express = require("express");
const connectDB = require("./config/database");
const { PORT,JWT_SECRET } = require("./config/serverConfig");
const bcrypt = require("bcrypt");
const { adminAuth, userAuth } = require("./middlewares/auth");
const User = require("./models/user");
const jwt = require('jsonwebtoken')
const { validateSignUp } = require("./utils/validation");
const cookieParser = require("cookie-parser");
const app = express();
app.use(cookieParser());
app.use(express.json());
app.post("/signup", async (req, res) => {
  try {
    // Destructing the data
    const { firstName, lastName, emailId, password, age, gender } = req.body;

    // Validating the data
    validateSignUp(req);

    // Doing hashing by auto generating salt and applying 10 round on plain password
    const hashpassword = await bcrypt.hash(password, 10);

    // Creating new instance of User model by the data
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: hashpassword,
      age,
      gender,
    });

    // Saving in DB
    await user.save();
    res.send("User signuped successfully");
  } catch (error) {
    return res.status(400).send(error.message);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid credentials");
    }
    const isPassword = await bcrypt.compare(password, user.password);
   
    if (isPassword) {
      const token = await jwt.sign({_id:user._id},JWT_SECRET,{expiresIn:'1h'});
      res.cookie('token',token);
      res.send("Logined Successfully");
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (error) {
    res.status(404).send(error.message);
  }
});
app.get("/profile",userAuth,async(req,res)=>{
    const user = req.user;
    res.send(user);
})

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
