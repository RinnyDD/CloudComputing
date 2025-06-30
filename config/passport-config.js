const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const db = require('../models/db');  // Your database connection (assuming you're using it for storing users)
require('dotenv').config();


// Set up the Google OAuth strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:3000/auth/google/callback'
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Find or create user in your database using profile data
      const email = profile.emails[0].value;
      const name = profile.displayName;


      // You can choose to either find an existing user or create a new one
      const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

      if (rows.length > 0) {
        await db.query(
            'UPDATE users SET googleid = ? WHERE email = ?',
            [accessToken, email]
          );
        // If user exists, pass user data to done()
        return done(null, rows[0]);
      } else {
        // If user doesn't exist, create a new user and return
        const [result] = await db.query(
          'INSERT INTO users (firstname, lastname, email, googleid) VALUES (?, ?, ?, ?)',
          [name.split(' ')[0], name.split(' ')[1] || '', email, accessToken]
        );

        const newUser = {
          id: result.insertId,
          firstname: name.split(' ')[0],
          lastname: name.split(' ')[1] || '',
          email: email
        };

        return done(null, newUser);
      }
    } catch (error) {
      return done(error, null);
    }
  }
));

// Serialize user information to store in session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user based on the ID stored in the session
passport.deserializeUser(async (id, done) => {
  try {
    const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
    done(null, rows[0]);
  } catch (error) {
    done(error);
  }
});
