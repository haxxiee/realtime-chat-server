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

const { getAllUsers, createUser } = require("./utils/users");
const { getAllRooms, createRoom, deleteRoom } = require("./utils/rooms");
const { getMessages, deleteMessages } = require("./utils/messages");

const db = require("./config/db");
const PORT = process.env.PORT || 4000;

io.on("connection", (socket) => {
  console.log(`User with id ${socket.id} has connected`);

  socket.on("ready", async () => {
    const users = await getAllUsers();
    const rooms = await getAllRooms();
    socket.emit("initial_data", { users: users, rooms: rooms });
  });

  socket.on("create_user", async (user) => {
    await createUser(socket, user);
  });

  socket.on("create_room", async (room) => {
    await createRoom(socket, room);
  });

  socket.on("delete_room", async (room) => {
    await deleteRoom(socket, room);
    await deleteMessages(room);
  });

  socket.on("get_messages", async (room) => {
    const messages = await getMessages(room);
    const test = await getMessages("Room 2");
    console.log("First mes", messages, "Then test", test);
    console.log(room);

    socket.emit("messages", messages);
  });
});

server.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});
