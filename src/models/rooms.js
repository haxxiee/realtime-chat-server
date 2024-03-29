const db = require("../config/db");

async function getAllRooms() {
  const sql = `SELECT * FROM rooms`;

  return db
    .query(sql)
    .then((res) => {
      return res.rows;
    })
    .catch((e) => console.error(e.stack));
}

async function createRoom(socket, room) {
  const sql = `INSERT INTO rooms (name) VALUES ($1)`;

  const rooms = await getAllRooms();
  const checkRoom = (obj) => obj.name.toLowerCase() === room.toLowerCase();

  if (rooms.some(checkRoom)) {
    socket.emit("room_error", "ROOM NAME ALREADY IN USE");
    return;
  }
  room.length > 1
    ? db.query(sql, [room], (error) => {
        if (error) {
          console.error(error.message);
        }
      })
    : socket.emit("room_error", "NEED TO FILL IN ROOM NAME");
}

function deleteRoom(socket, room) {
  const sql = `DELETE FROM rooms WHERE name = $1`;

  room.length > 1
    ? db.query(sql, [room], async (error) => {
        if (error) {
          console.error(error.message);
        }
        const rooms = await getAllRooms();
      })
    : socket.emit("room_error", "NEED TO FILL IN ROOM NAME");
}

module.exports = {
  getAllRooms,
  createRoom,
  deleteRoom,
};
