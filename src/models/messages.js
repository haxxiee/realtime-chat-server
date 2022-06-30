const { v4: uuidv4 } = require("uuid");
const db = require("../config/db");
const { getAllRooms } = require("./rooms");

async function getMessages(socket, room) {
  const sql = `SELECT * FROM messages WHERE room_id = ?`;

  if (!room) {
    return;
  } else {
    const rooms = await getAllRooms();
    const findRoom = rooms.find((x) => x.name === room);

    if (!findRoom) {
      socket.emit("room_error", "Room does not exist anymore");
      return;
    }

    return new Promise((resolve, reject) => {
      db.all(sql, findRoom.id, (error, rows) => {
        if (error) {
          console.error(error.message);
          reject(error);
        }
        resolve(rows);
      });
    });
  }
}

async function addMessage(socket, data) {
  const sql = `INSERT INTO messages (id, message, user_name, room_id, user_id) VALUES (?, ?, ?, ?, ?)`;

  if (!data.message) return;

  const rooms = await getAllRooms();
  const room = rooms.find((x) => x.name === data.roomName);
  const messageId = uuidv4();

  if (!room) {
    socket.emit("room_error", "Room does not exist anymore");
    return;
  }

  return new Promise((resolve, reject) => {
    db.run(
      sql,
      [messageId, data.message, data.username, room.id, data.userId],
      (error) => {
        if (error) {
          console.error(error.message);
          reject(error);
        }
        const newMessage = {
          id: messageId,
          message: data.message,
          user_name: data.username,
          room_id: room.id,
          user_id: data.userId,
        };

        socket.to(data.roomName).emit("new_message", newMessage);
        resolve();
      }
    );
  });
}

async function deleteMessages(room) {
  const sql = `DELETE FROM messages WHERE id = ?`;

  if (!room) {
    return;
  } else {
    const rooms = await getAllRooms();
    const { id } = rooms.filter((x) => x.name === room);

    return new Promise((resolve, reject) => {
      db.all(sql, id, (error) => {
        if (error) {
          console.error(error.message);
          reject(error);
        }
        resolve();
      });
    });
  }
}

module.exports = {
  deleteMessages,
  getMessages,
  addMessage,
};
