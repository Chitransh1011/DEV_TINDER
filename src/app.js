const express = require("express");
const connectDB = require("./config/database");
const { PORT } = require("./config/serverConfig");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");
const cors = require("cors");
const paymentRouter = require("./routes/payment");
const http = require('http');
const intitializeSocket = require("./utils/socket");
const chatRouter = require("./routes/chat");
require("./utils/cronJob")
const app = express();



//MIDDLEWARE
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://dev-tinder-ui-kappa.vercel.app",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  })
);

app.use(cookieParser());
app.use(express.json());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/", paymentRouter);
app.use("/", chatRouter);

const server = http.createServer(app);
intitializeSocket(server);


connectDB()
  .then(() => {
    console.log("Database connected successfully");
    server.listen(PORT, () => {
      console.log(`Server started on PORT : ${process.env.PORT || 3001}`);
    });
  })
  .catch(() => {
    console.error("Database not connected");
  });
