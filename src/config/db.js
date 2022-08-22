// const sqlite3 = require("sqlite3").verbose();

const { Client } = require("pg");

const db = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

db.connect();

const users = `
    CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE
    )`;
const rooms = `
    CREATE TABLE IF NOT EXISTS rooms (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE
    )`;

const messages = `
    CREATE TABLE IF NOT EXISTS messages (
    id TEXT PRIMARY KEY,
    message TEXT NOT NULL,
    user_name TEXT NOT NULL,
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

db.query(users, (error) => {
  if (error) {
    console.error(error);
    throw error;
  }
});

db.query(rooms, (error) => {
  if (error) {
    console.error(error);
    throw error;
  }
  db.query("INSERT INTO rooms (name) VALUES ($1)", ["Room1"]);
  db.query("INSERT INTO rooms (name) VALUES ($1)", ["Room2"]);
  db.query("INSERT INTO rooms (name) VALUES ($1)", ["Room3"]);
  db.query("INSERT INTO rooms (name) VALUES ($1)", ["Room4"]);
});

db.query(messages, (error) => {
  if (error) {
    console.error(error);
    throw error;
  }
});
// const db = new sqlite3.Database("./db.sqlite", (error) => {
//   if (error) {
//     console.error(error.message);
//     throw error;
//   }

//   console.log("Connection established");
//   db.get("PRAGMA foreign_keys = ON");

//   const users = `
//       CREATE TABLE users (
//       id INTEGER PRIMARY KEY AUTOINCREMENT,
//       name TEXT NOT NULL UNIQUE
//       )`;
//   const rooms = `
//       CREATE TABLE rooms (
//       id INTEGER PRIMARY KEY AUTOINCREMENT,
//       name TEXT NOT NULL UNIQUE
//       )`;

//   const messages = `
//       CREATE TABLE messages (
//       id TEXT PRIMARY KEY,
//       message TEXT NOT NULL,
//       user_name TEXT NOT NULL,
//       room_id INTEGER,
//       user_id INTEGER,
//       CONSTRAINT fk_user_name
//         FOREIGN KEY(user_name)
//         REFERENCES users(name)
//         ON DELETE CASCADE
//       CONSTRAINT fk_room_id
//        FOREIGN KEY(room_id)
//        REFERENCES rooms(id)
//        ON DELETE CASCADE,
//       CONSTRAINT fk_user_id
//        FOREIGN KEY(user_id)
//        REFERENCES users(id)
//        ON DELETE CASCADE
//       )`;

//   db.run(users, (error) => {
//     if (error) {
//       console.error(error.message);
//       return;
//     }
//   });
//   db.run(rooms, (error) => {
//     if (error) {
//       console.error(error.message);
//       return;
//     } else {
//       const insertRoom = "INSERT INTO rooms (name) VALUES (?)";
//       db.run(insertRoom, "Room 1");
//       db.run(insertRoom, "Room 2");
//       db.run(insertRoom, "Room 3");
//       db.run(insertRoom, "Room 4");
//     }
//   });
//   db.run(messages, (error) => {
//     if (error) {
//       console.error(error.message);
//       return;
//     }
//   });
// });

module.exports = db;
