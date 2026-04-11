const express = require("express");
const http = require("http");
const cors = require("cors");
const mongoose = require("mongoose");
const redis = require('./config/redis.js');
const authentication = require("./middleware/authentication.js");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const { initSocket } = require("./socket/socket.js");
const { socketHandler } = require("./socket/socketHandler.js");

const app = express();
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

const server = http.createServer(app);

// Mongo connection
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("DB Connected"))
  .catch((err) => console.log(err));

// init socket
const io = initSocket(server);

// attach handler
socketHandler(io);


// connected redis
  // redis.set("test", "RozgarHub");
  
  // routes
  app.use("/api/user", require("./routes/user.routes.js"));
  app.use(authentication);
  app.use("/api/job", require("./routes/job.route.js"));
  app.use("/api/jobApplied", require("./routes/jobApplied.route.js"));
  app.use("/api/notification", require("./routes/notification.route.js"));
  app.use("/api", require("./routes/chat.route.js"));

const PORT = process.env.PORT || 3002;
server.listen(PORT, () => console.log("Server Started!"));
