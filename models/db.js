const mysql = require("mysql2/promise");
require("dotenv").config();

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  port: process.env.DB_PORT || 3306, // Default MySQL port
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

module.exports = db;
