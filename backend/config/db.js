const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  multipleStatements: true,
});

connection.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
    return;
  }

  console.log("MySQL Connected");

  connection.query(
    `
    CREATE DATABASE IF NOT EXISTS studyguide;
    USE studyguide;

    CREATE TABLE IF NOT EXISTS notes (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      content TEXT NOT NULL,
      category VARCHAR(100),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    `,
    (err) => {
      if (err) {
        console.error("Database/Table creation failed:", err);
        return;
      }

      console.log("Database and notes table are ready.");
    }
  );
});

module.exports = connection;