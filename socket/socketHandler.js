const jwt = require("jsonwebtoken");
const Message = require("../models/message.model");
const cookie = require("cookie");

const onlineUsers = new Map();

const socketHandler = (io) => {
  // JWT Auth
  io.use((socket, next) => {
    try {
      const cookies = cookie.parse(socket.handshake.headers.cookie || "");

      const token = cookies.token;

      if (!token) {
        return next(new Error("No token"));
      }

      const user = jwt.verify(token, process.env.JWT_SECRET);

      socket.userId = user.id;

      next();
    } catch (err) {
      console.log("Socket Auth Error:", err.message);
      next(new Error("Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    const userId = socket.userId;

    console.log("Socket connected");

    // store online user
    onlineUsers.set(userId.toString(), socket.id);

    // Join group
    socket.on("joinGroup", (groupId) => {
      socket.join(groupId.toString());
    });

    // Send message
    socket.on("sendMessage", async (data) => {
      let message = await Message.create({
        groupId: data.groupId,
        message: data.message,
        senderId: socket.userId,
      });

      // populate sender
      message = await message.populate("senderId", "fullname");

      io.to(data.groupId.toString()).emit("receiveMessage", message);
    });

    // Disconnect
    socket.on("disconnect", () => {
      // console.log("Disconnected:", userId);
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
