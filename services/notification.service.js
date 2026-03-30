const Notification = require("../models/notification.model");
const redis = require("../config/redis");
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
  await redis.del(`notifications:${contractorId}`);
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
  await redis.del(`notifications:${receiverId}`);
  return notification;
}

async function getNotifications(userId) {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("invalid user id");
  }

  const cacheKey = `notifications:${userId}`;
  const cachedData = await redis.get(cacheKey);
  
  if (cachedData) {
    return JSON.parse(cachedData);
  }

  const notification = await Notification.find({
    receiverId: userId,
  })
    .sort({ createdAt: -1 })
    .populate("senderId", "fullname")
    .populate("receiverId", "fullname");

    await redis.set(cacheKey, JSON.stringify(notification), "EX", 30);
  return notification;
}

async function markAsRead(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid ID");
  }
  const notification = await Notification.findByIdAndUpdate(
    id,
    { isRead: true },
    { new: true },
  );
  await redis.del(`notifications:${notification.id}`);
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
  await redis.del(`notifications:${userId}`);
  return notification;
}

module.exports = {
  workerNotification,
  getNotifications,
  contractorNotification,
  markAsRead,
  markAllAsRead,
};
