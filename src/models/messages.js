const { v4: uuidv4 } = require("uuid");
const db = require("../config/db");
const { getAllRooms } = require("./rooms");

async function getMessages(socket, room) {
  const sql = `SELECT * FROM messages WHERE room_id = $1`;

  if (!room) {
    return;
  } else {
    const rooms = await getAllRooms();
    const findRoom = rooms.find((x) => x.name === room);

    if (!findRoom) {
      socket.emit("room_error", "Room does not exist anymore");
      return;
    }

    return db.query(sql, findRoom.id, (error, rows) => {
      if (error) {
        console.error(error.message);
      }
      return rows;
    });
  }
}

async function addMessage(socket, data) {
  const sql = `INSERT INTO messages (id, message, user_name, room_id, user_id) VALUES ($1, $2, $3, $4, $5)`;

  if (!data.message) return;

  const rooms = await getAllRooms();
  const room = rooms.find((x) => x.name === data.roomName);
  const messageId = uuidv4();

  if (!room) {
    socket.emit("room_error", "Room does not exist anymore");
    return;
  }

  return db.query(
    sql,
    [messageId, data.message, data.username, room.id, data.userId],
    (error) => {
      if (error) {
        console.error(error.message);
      }
      const newMessage = {
        id: messageId,
        message: data.message,
        user_name: data.username,
        room_id: room.id,
        user_id: data.userId,
      };

      socket.to(data.roomName).emit("new_message", newMessage);
    }
  );
}

async function deleteMessages(room) {
  const sql = `DELETE FROM messages WHERE id = $1`;

  if (!room) {
    return;
  } else {
    const rooms = await getAllRooms();
    const { id } = rooms.filter((x) => x.name === room);

    return db.query(sql, id, (error) => {
      if (error) {
        console.error(error.message);
      }
    });
  }
}

module.exports = {
  deleteMessages,
  getMessages,
  addMessage,
};
