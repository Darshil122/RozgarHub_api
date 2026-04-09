const jwt = require("jsonwebtoken");
const Message = require("../models/message.model");

const onlineUsers = new Map(); // userId -> socketId

const socketHandler = (io) => {
  // JWT Auth
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      const user = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = user;
      next();
    } catch (err) {
      next(new Error("Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    const userId = socket.user.id;

    console.log("User connected:", userId);

    // store online user
    onlineUsers.set(userId.toString(), socket.id);

    // Join group
    socket.on("joinGroup", (groupId) => {
      socket.join(groupId);
    });

    // Send message
    socket.on("sendMessage", async ({ groupId, message }) => {
      const newMessage = await Message.create({
        groupId,
        senderId: userId,
        message,
      });

      io.to(groupId).emit("receiveMessage", newMessage);
    });

    // Disconnect
    socket.on("disconnect", () => {
      console.log("Disconnected:", userId);
      onlineUsers.delete(userId.toString());
    });
  });
};

// helper for API
const getReceiverSocketId = (userId) => {
  return onlineUsers.get(userId.toString());
};

module.exports = {
  socketHandler,
  getReceiverSocketId,
};
