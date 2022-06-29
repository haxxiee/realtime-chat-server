const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./db.sqlite", (error) => {
  if (error) {
    console.error(error.message);
    throw error;
  }

  console.log("Connection established");
  db.get("PRAGMA foreign_keys = ON");

  const users = `
      CREATE TABLE users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE
      )`;
  const rooms = `
      CREATE TABLE rooms (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE
      )`;
  // const messages = `
  //     CREATE TABLE messages (
  //     id TEXT PRIMARY KEY,
  //     message TEXT NOT NULL,
  //     user TEXT NOT NULL,
  //     room_id INTEGER NOT NULL,
  //     user_id INTEGER NOT NULL,
  //     FOREIGN KEY (user)
  //         REFERENCES users (name)
  //         ON DELETE CASCADE,
  //     FOREIGN KEY (room_id)
  //         REFERENCES rooms (id)
  //         ON DELETE CASCADE,
  //     FOREIGN KEY (user_id)
  //         REFERENCES users (id)
  //         ON DELETE CASCADE
  //     )`;

  const messages = `
      CREATE TABLE messages (
      id TEXT PRIMARY KEY,
      message TEXT NOT NULL,
      room_id INTEGER,
      user_id INTEGER,
      CONSTRAINT fk_room_id
       FOREIGN KEY(room_id) 
       REFERENCES rooms(id)
       ON DELETE CASCADE,
      CONSTRAINT fk_user_id
       FOREIGN KEY(user_id)
       REFERENCES users(id)
       ON DELETE CASCADE
      )`;

  db.run(users, (error) => {
    if (error) {
      console.error(error.message);
      return;
    } else {
      const insertUser = "INSERT INTO users (name) VALUES (?)";
      db.run(insertUser, "Lasse");
      db.run(insertUser, "Bosse");
      db.run(insertUser, "Jonas");
      db.run(insertUser, "Kenny");
    }
  });
  db.run(rooms, (error) => {
    if (error) {
      console.error(error.message);
      return;
    } else {
      const insertRoom = "INSERT INTO rooms (name) VALUES (?)";
      db.run(insertRoom, "Room 1");
      db.run(insertRoom, "Room 2");
      db.run(insertRoom, "Room 3");
      db.run(insertRoom, "Room 4");
    }
  });
  db.run(messages, (error) => {
    if (error) {
      console.error(error.message);
      return;
    } else {
      const insertMessage =
        "INSERT INTO messages (id, message, room_id, user_id) VALUES (?, ?, ?, ?);";

      db.run(insertMessage, ["AF34GGf9s7", "Tjenare Jonas!", 1, 1]);
      db.run(insertMessage, ["KGSDL3252", "lassebror", 2, 2]);
      db.run(insertMessage, ["OLSFKSEG42", "FYFAN VA BRA", 1, 1]);
    }
  });
});

module.exports = db;
