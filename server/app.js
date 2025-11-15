const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);

app.use(cors({
  origin: '*',
  methods: ["GET", "POST"]
}));

const io = new Server(server, {
  cors: {
    origin: "*",
  }
});

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("joinGame", ({ gameID }) => {
    // console.log(`Socket ${socket.id} joined game ${gameID}`);
    socket.join(gameID);
  });

  socket.on("chat message", ({ gameID, message }) => {
    console.log(`Message in game ${gameID}: ${message}`);
    io.to(gameID).emit("chat message", { gameID, message });
  });

  socket.on("commands", ({ gameID, commands }) => {
    console.log(`Commands in game ${gameID}: ${commands}`);
    console.log("From socket ID:", socket.id);
    io.to(gameID).emit("commands", { gameID, commands, socketID: socket.id }); 
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

app.get("/", (req, res) => {
  res.json({ name: "bonjour" });
});

app.get("/gameID", (req, res) => {
  const gameID = Math.random().toString(36).substring(2, 8).toUpperCase();
  res.json({ gameID });
});


const PORT = process.env.PORT || 5000;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server + Socket.IO running on *:${PORT}`);
});

