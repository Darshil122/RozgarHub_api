const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const PORT = process.env.PORT || 3002;
const authentication = require("./middleware/authentication.js");

dotenv.config();
app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("DB Connected"))
  .catch((err) => console.log(err));

app.use("/api/user", require("./routes/user.routes.js"));
app.use(authentication);
app.use("/api/job", require("./routes/job.route.js"));
app.use("/api/jobApplied", require("./routes/jobApplied.route.js"));
app.use("/api/notification", require("./routes/notification.route.js"));


app.listen(PORT, () => console.log("Server Started!"));
