const GroupChat = require("../models/groupChat.model");
const Message = require("../models/message.model");
const mongoose = require("mongoose");

async function getMyGroups(userId) {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid User Id");
  }

  const groups = await GroupChat.find({
    members: userId,
  }).select("_id jobId groupName");

  return groups;
}

async function getMessages(groupId){

  const messages = await Message.find({groupId}).populate("senderId", "fullname").sort({ createdAt: 1});

  return messages;
}

module.exports = { getMyGroups, getMessages };
