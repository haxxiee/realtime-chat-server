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
});

db.query(messages, (error) => {
  if (error) {
    console.error(error);
    throw error;
  }
});

module.exports = db;
