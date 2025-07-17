const express = require("express");
const connectDB = require("./config/database");
const { PORT } = require("./config/serverConfig");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");

const app = express();

//MIDDLEWARE
app.use(cookieParser());
app.use(express.json());

app.use('/',authRouter);
app.use('/',profileRouter);



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
