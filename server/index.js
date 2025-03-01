const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const messageRoutes = require("./routes/messages");
const socket = require("socket.io");
require("dotenv").config();

const app = express();

// ✅ Log frontend URL to ensure it's correct
console.log("Frontend URL:", process.env.FRONTEND_URL);

// ✅ Set up CORS properly
app.use(
  cors({
    origin: process.env.FRONTEND_URL, // Deployed frontend URL from .env
    credentials: true, // Allow cookies/auth
    methods: ["GET", "POST", "PUT", "DELETE"], // Allow these methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allow these headers
  })
);

app.use(express.json());

console.log(process.env.MONGO_URL);
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("DB Connection Successful"))
  .catch((err) => console.log(err.message));

// ✅ Register Routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// ✅ Start Server
const server = app.listen(process.env.PORT, () =>
  console.log(`Server started on ${process.env.PORT}`)
);

// ✅ Set Up Socket.io with CORS
const io = socket(server, {
  cors: {
    origin: process.env.FRONTEND_URL, // Use the same frontend URL
    credentials: true,
  },
});

// Global variable to store online users
global.onlineUsers = new Map();

// Socket.IO connection handler
io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  // Add user to onlineUsers map
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
    console.log(`User ${userId} connected with socket ID: ${socket.id}`);
  });

  // Handle sending messages
  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      // Emit the message to the recipient
      socket.to(sendUserSocket).emit("msg-receive", {
        message: data.msg,
        from: data.from, // Include the sender's ID
      });
      console.log(`Message sent from ${data.from} to ${data.to}: ${data.msg}`);
    } else {
      console.log(`User ${data.to} is offline.`);
    }
  });

  // Handle client disconnection
  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
    // Remove user from onlineUsers map
    for (const [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
        console.log(`User ${userId} disconnected.`);
        break;
      }
    }
  });
});