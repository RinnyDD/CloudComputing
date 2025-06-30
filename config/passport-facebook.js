const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const db = require('../models/db');  // Your database connection (assuming you're using MySQL)
require('dotenv').config();

// Set up the Facebook OAuth strategy
passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: 'http://localhost:3000/auth/facebook/callback',
  profileFields: ['id', 'displayName', 'email']  // Requesting profile info and email
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails[0].value;  // Get the email address
    const name = profile.displayName;

    // Look up the user in the database by email
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

    if (rows.length > 0) {
      // If the user exists, update the Facebook ID (if it's not already set)
      if (!rows[0].facebookId) {
        await db.query('UPDATE users SET facebookId = ? WHERE email = ?', [profile.id, email]);
      }
      return done(null, rows[0]);  // Pass user data to done() for serialization
    } else {
      // If the user doesn't exist, create a new user in the database
      const [result] = await db.query(
        'INSERT INTO users (firstname, lastname, email, facebookId) VALUES (?, ?, ?, ?)',
        [name.split(' ')[0], name.split(' ')[1] || '', email, profile.id]
      );

      const newUser = {
        id: result.insertId,
        firstname: name.split(' ')[0],
        lastname: name.split(' ')[1] || '',
        email: email
      };

      return done(null, newUser);  // Return the new user data
    }
  } catch (error) {
    return done(error, null);  // Handle any errors and pass them to done()
  }
}));

// Serialize user information to store in the session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user information from the session
passport.deserializeUser(async (id, done) => {
  try {
    const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
    done(null, rows[0]);
  } catch (error) {
    done(error);
  }
});
