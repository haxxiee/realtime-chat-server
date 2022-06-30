const fs = require("fs");

function loggingMessages(data) {
  if (data) {
    const newData = {
      date: new Date().toLocaleString("sv-SE", { timeZone: "UTC" }),
      message: data.message,
      username: data.username,
      userId: data.userId,
      roomName: data.roomName,
    };
    fs.appendFile("messages.txt", JSON.stringify(newData) + "\n", (err) => {
      if (err) return err.errno;
    });
  }
}

module.exports = {
  loggingMessages,
};
