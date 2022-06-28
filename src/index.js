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

const { getAllUsers, createUser, getUser } = require("./utils/users");
const { getAllRooms, createRoom } = require("./utils/rooms");

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

    //Ska skicka userinfo och spara som state
    // const data = await getUser(user);
    // console.log(data);
    // socket.emit("user_info", data);
  });

  socket.on("create_room", async (room) => {
    createRoom(socket, room);
  });
});

server.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});
