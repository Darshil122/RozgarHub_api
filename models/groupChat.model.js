const mongoose = require('mongoose');
const Job = require('./job.model');
const User = require('./user.model');

const groupChatShcema = mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Job,
      required: true,
    },
    contractorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User,
      required: true,
    },
    groupName:{
      type: String,
      required: true,
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: User,
      },
    ],
    lastMessage: {
      type: String,
      deafult: "",
    },
  },
  { timestamps: true },
);

const GroupChat = mongoose.model("GroupChat", groupChatShcema);
module.exports = GroupChat; 