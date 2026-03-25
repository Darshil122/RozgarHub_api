const Notification = require("../models/notification.model");
const mongoose = require("mongoose");

async function workerNotification(
  workerId,
  contractorId,
  jobId,
  workerName,
  jobTitle,
) {
  if (!mongoose.Types.ObjectId.isValid(workerId)) {
    throw new Error("invalid user id");
  }

  const notification = new Notification({
    senderId: workerId,
    receiverId: contractorId,
    jobId: jobId,
    notification_type: "job_applied",
    message: `${workerName || "A worker"} applied to ${jobTitle}`,
  });

  await notification.save();
  return notification;
}

async function contractorNotification({
  senderId,
  receiverId,
  jobId,
  type,
  message,
}) {
  if (!receiverId || !jobId) {
    console.log("Invalid:", { receiverId, jobId });
    throw new Error("Invalid IDs");
  }

  const notification = new Notification({
    senderId,
    receiverId,
    jobId,
    notification_type: type,
    message,
  });

  await notification.save();
  return notification;
}

async function getNotifications(userId) {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("invalid user id");
  }
  const notification = await Notification.find({
    receiverId: userId,
  })
    .sort({ createdAt: -1 })
    .populate("senderId", "fullname")
    .populate("receiverId", "fullname");

  return notification;
}

async function markAsRead(id) {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    throw new Error("Invalid ID");
  }
  const notification = await Notification.findByIdAndUpdate(
    id,
    { isRead: true },
    { new: true },
  );
  return notification;
}

async function markAllAsRead(userId) {
  if (!userId) {
    throw new Error("User id is not valid");
  }
  const notification = await Notification.updateMany(
    { receiverId: userId, isRead: false },
    { isRead: true },
  );
  return notification;
}

module.exports = {
  workerNotification,
  getNotifications,
  contractorNotification,
  markAsRead,
  markAllAsRead,
};
