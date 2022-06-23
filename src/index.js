const express = require(`express`);
const app = express();
const http = require(`http`);
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const { getAllUsers, getAllRooms } = require("./utils/users");

const db = require("./config/db");
const PORT = process.env.PORT || 4000;

io.on("connection", (socket) => {
  console.log(`User with id ${socket.id} has connected`);

  socket.on("ready", async () => {
    const users = await getAllUsers();
    const rooms = await getAllRooms();
    socket.emit("initial_data", { users: users, rooms: rooms });
  });

  // const rooms = await getAllRooms();
  // console.log(rooms);
  // socket.emit("all_rooms", rooms);

  socket.on("get_rooms", async () => {
    const rooms = await getAllRooms();
    console.log(rooms);
    socket.emit("all_rooms", rooms);
  });
});

server.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});
