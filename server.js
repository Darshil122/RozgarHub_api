const express = require("express");
const http = require("http");
const {Server} = require("socket.io");
const cors = require("cors");
const mongoose = require("mongoose");
const redis = require('./config/redis.js');
const authentication = require("./middleware/authentication.js");
require("dotenv").config();

const { socketHandler } = require("./socket");

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);

// Mongo connection
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("DB Connected"))
  .catch((err) => console.log(err));

// socket.io setup
const io = new Server(server, {
  cors:{
    origin: "*",
  },
});

socketHandler(io);


// connected redis
  // redis.set("test", "RozgarHub");
  
  // routes
  app.use("/api/user", require("./routes/user.routes.js"));
  app.use(authentication);
  app.use("/api/job", require("./routes/job.route.js"));
  app.use("/api/jobApplied", require("./routes/jobApplied.route.js"));
  app.use("/api/notification", require("./routes/notification.route.js"));

const PORT = process.env.PORT || 3002;
server.listen(PORT, () => console.log("Server Started!"));
