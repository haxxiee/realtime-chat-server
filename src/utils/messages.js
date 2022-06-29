const db = require("../config/db");
const { getAllRooms } = require("./rooms");

async function getMessages(room) {
  const sql = `SELECT * FROM messages WHERE room_id = ?`;

  const rooms = await getAllRooms();
  const { id } = rooms.find((x) => x.name === room);
  console.log("här är id i getmess", rooms);
  console.log("test", id);

  return new Promise((resolve, reject) => {
    db.all(sql, id, (error, rows) => {
      if (error) {
        console.error(error.message);
        reject(error);
      }
      resolve(rows);
    });
  });
}

async function deleteMessages(room) {
  const sql = `DELETE FROM messages WHERE id = ?`;

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

module.exports = {
  deleteMessages,
  getMessages,
};
