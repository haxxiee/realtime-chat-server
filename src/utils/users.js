const db = require("../config/db");

function getAllUsers() {
  const sql = `SELECT * FROM users`;

  return new Promise((resolve, reject) => {
    db.all(sql, (error, rows) => {
      if (error) {
        console.error(error.message);
        reject(error);
      }
      resolve(rows);
    });
  });
}

// UNIKA NAMN? FÖR ATT HITTA USER
async function getUser(username) {
  const users = await getAllUsers();

  const found = users.find(
    (obj) => obj.name.toLowerCase() === username.toLowerCase()
  );

  return found;
}

async function createUser(socket, user) {
  const sql = `INSERT INTO users (name) VALUES (?)`;

  const users = await getAllUsers();
  const checkUsername = (obj) => obj.name.toLowerCase() === user.toLowerCase();

  if (users.some(checkUsername)) {
    socket.emit("user_error", "USERNAME ALREADY IN USE");
    return;
  }
  user.length > 1
    ? new Promise((resolve, reject) => {
        db.all(sql, user, async (error) => {
          if (error) {
            console.error(error.message);
            reject(error);
          }
          resolve();
          const data = await getUser(user);
          socket.emit("user_info", data);
        });
      })
    : socket.emit("user_error", "NEED TO FILL IN NAME");
}

module.exports = {
  getAllUsers,
  createUser,
  getUser,
};
