const jwt = require("jsonwebtoken");
const socketHandler = (io) => {
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      const user = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = user;
      next();
    } catch (err) {
      return next(new Error("Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    console.log("User connected", socket.user.id);

    socket.on("disconnect", () => {
      console.log("Disconnected", socket.user.id);
    });
  });
};

module.exports = {
  socketHandler,
};
