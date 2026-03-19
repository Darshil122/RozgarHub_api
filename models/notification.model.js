const mongoose = require("mongoose");
const User = require("./user.model");
const Job = require("./job.model");

const notificationSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User,
    },
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Job,
    },
    notification_type: {
      type: String,
      enum: ["job_applied", "update_status"],
    },
    message: {
      type: String,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

const Notification = mongoose.model("Notification", notificationSchema);
module.exports = Notification;
