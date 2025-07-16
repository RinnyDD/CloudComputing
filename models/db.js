const mysql = require("mysql2/promise");
require("dotenv").config({ path: __dirname + "/../.env" }); // Ensure correct path when used from other files

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = db;
