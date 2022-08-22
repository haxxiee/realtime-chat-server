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

const { createUser } = require("./models/users");
const { getAllRooms, createRoom, deleteRoom } = require("./models/rooms");
const {
  getMessages,
  deleteMessages,
  addMessage,
} = require("./models/messages");
const { loggingMessages } = require("./middleware/loggingMessages");

const PORT = process.env.PORT || 4000;

io.use((socket, next) => {
  socket.on("message", (data) => {
    loggingMessages(data);
  });
  next();
});

io.on("connection", (socket) => {
  console.log(`User with id ${socket.id} has connected`);

  socket.on("ready", async () => {
    const rooms = await getAllRooms();
    socket.emit("initial_data", rooms);
  });

  socket.on("create_user", async (user) => {
    await createUser(socket, user);
  });

  socket.on("create_room", async (room) => {
    await createRoom(socket, room);
    const rooms = await getAllRooms();
    io.sockets.emit("initial_data", rooms);
  });

  socket.on("join_room", (room) => {
    socket.join(room);
  });

  socket.on("leave_room", (room) => {
    socket.leave(room);
  });

  socket.on("delete_room", async (room) => {
    await deleteRoom(socket, room);
    await deleteMessages(room);
    const rooms = await getAllRooms();
    io.sockets.emit("initial_data", rooms);
  });

  socket.on("get_messages", async (room) => {
    const messages = await getMessages(socket, room);
    const test = await getMessages("Room 2");

    socket.emit("messages", messages);
  });

  socket.on("message", async (data) => {
    await addMessage(socket, data);
  });
});

server.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});
