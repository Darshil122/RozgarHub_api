const mongoose = require('mongoose');
const GroupChat = require('./groupChat.model');
const User = require('./user.model');

const messageSchema = mongoose.Schema(
  {
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: GroupChat,
      required: true,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User,
      required: true,
    },
    message: {
      type: String,
    },
  },
  { timestamps: true },
);

const Message = mongoose.model("Message", messageSchema);
module.exports = Message;