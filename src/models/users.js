const db = require("../config/db");

function getAllUsers() {
  const sql = `SELECT * FROM users`;

  return db
    .query(sql)
    .then((res) => {
      return res.rows;
    })
    .catch((e) => console.error(e.stack));
}

async function getUser(username) {
  let users = await getAllUsers();

  const found = users.find(
    (obj) => obj.name.toLowerCase() === username.toLowerCase()
  );

  return found;
}

async function createUser(socket, user) {
  const sql = `INSERT INTO users (name) VALUES ($1)`;

  let users = await getAllUsers();
  const checkUsername = (obj) => obj.name.toLowerCase() === user.toLowerCase();

  if (users.some(checkUsername)) {
    socket.emit("user_error", "USERNAME ALREADY IN USE");
    return;
  }
  user.length > 1
    ? db.query(sql, [user], async (error) => {
        if (error) {
          console.error(error.message);
        }
        const data = await getUser(user);
        socket.emit("user_info", data);
      })
    : socket.emit("user_error", "NEED TO FILL IN NAME");
}

module.exports = {
  getAllUsers,
  createUser,
  getUser,
};
