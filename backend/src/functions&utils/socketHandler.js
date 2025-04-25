// socket.js
const { Server } = require("socket.io");

let io; // to hold the io instance

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("joinUser", (userId) => {
      socket.join(userId);
      console.log(`User ${userId} joined room ${userId}`);
    });

    socket.on("HouseHold-Donor", (userId) => {
      socket.join("donor");
      console.log(`User ${userId} joined the Donor Room`);
    });

    socket.on("Restaurant-Donor", (userId) => {
      socket.join("donor");
      console.log(`User ${userId} joined the Donor Room`);
    });

    socket.on("Volunteer", (userId) => {
      socket.join("volunteer");
      console.log(`User ${userId} joined volunteer Room`);
    });

    socket.on("Manager", (userId) => {
      socket.join("manager");
      console.log(`User ${userId} joined Manager Room`);
    });

    socket.on("Admin", (userId) => {
      socket.join("admin");
      console.log(`User ${userId} joined admin Room`);
    });

    socket.on("notification", (message) => {
      console.log("Received notification:", message);
    });

    socket.on("join-tracking-room", (donationBoxId) => {
      socket.join(`tracking-${donationBoxId}`);
      console.log(`User joined tracking room for donation ${donationBoxId}`);
    });
    
    socket.on("leaveRoom", (userId) => {
      socket.leave(userId);
      console.log(`User ${userId} left room ${userId}`);
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${userId}`);
    });
  });
};

// to get io instance anywhere else in the app
const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};

module.exports = { initSocket, getIO };
