const mysql = require("mysql2");
const bcrypt = require("bcryptjs");
require("dotenv").config(); // Load environment variables from .env file

// Create a connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const promisePool = pool.promise();

// Register user (local or OAuth)
async function registerUser(
  firstname,
  lastname,
  email,
  password,
  googleId = null,
  facebookId = null
) {
  try {
    // Check if the email already exists
    const [existingUser] = await promisePool.query(
      `SELECT * FROM users WHERE email = ?`,
      [email]
    );

    if (existingUser.length > 0) {
      throw new Error("Email already exists");
    }

    let hashedPassword = null;

    // If it's a local registration, hash the password
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const [result] = await promisePool.query(
      `INSERT INTO users (firstname, lastname, email, password, googleId, facebookId) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [firstname, lastname, email, hashedPassword, googleId, facebookId]
    );

    return result;
  } catch (error) {
    console.error("Error during registration:", error);
    throw error;
  }
}

// Authenticate user (check email/password)
async function authenticateUser(email, password) {
  try {
    const [rows] = await promisePool.query(
      `SELECT * FROM users WHERE email = ?`,
      [email]
    );

    if (rows.length > 0) {
      const user = rows[0];
      console.log("User fetched from DB:", user);

      // Check password
      if (password) {
        const match = await bcrypt.compare(password, user.password);
        console.log("Password comparison result:", match);
        if (match) {
          return user; // Successful login
        }
      }
    }

    return null; // Invalid credentials
  } catch (error) {
    console.error("Error during authentication:", error);
    throw error;
  }
}

// Find user by Google ID or Facebook ID (for OAuth login)
async function findUserByOAuthId(googleId, facebookId) {
  try {
    if (!googleId && !facebookId) {
      return null; // Return null if neither OAuth ID is provided
    }

    let query = "";
    let params = [];

    if (googleId) {
      query = `SELECT * FROM users WHERE googleId = ?`;
      params = [googleId];
    } else if (facebookId) {
      query = `SELECT * FROM users WHERE facebookId = ?`;
      params = [facebookId];
    }

    const [rows] = await promisePool.query(query, params);

    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    console.error("Error during OAuth user lookup:", error);
    throw error;
  }
}

module.exports = {
  registerUser,
  authenticateUser,
  findUserByOAuthId,
  promisePool,
};

// === Connection Test - remove or comment out after testing ===
promisePool.query("SELECT 1 + 1 AS solution")
  .then(([rows]) => {
    console.log("DB Connection Test Result:", rows[0].solution);
  })
  .catch((err) => {
    console.error("DB Connection Test Failed:", err);
  });
