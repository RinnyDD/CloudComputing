const db = require('../models/db');
const User = require('../models/user');

// Register user
async function register(req, res) {
  const { firstname, lastname, email, password } = req.body;
  try {
    await User.registerUser(firstname, lastname, email, password);
    res.redirect('/login');
  } catch (error) {
    console.error(error);
    res.render('register', {
      messages: { error: [error.message] },
    });
  }
}

// Login user
async function login(req, res, next) {
  const { email, password } = req.body;
  try {
    const user = await User.authenticateUser(email, password);
    if (user) {
      req.login(user, (err) => {
        if (err) return next(err);
        res.redirect('/home');
      });
    } else {
      req.flash('error', 'Invalid credentials. Please try again.');
      res.redirect('/login');
    }
  } catch (error) {
    console.error(error);
    req.flash('error', 'An error occurred during login. Please try again.');
    res.redirect('/login');
  }
}

// Render home page (after login)
function home(req, res) {
  if (req.isAuthenticated()) {
    res.render('home', { user: req.user });
  } else {
    res.redirect('/login');
  }
}

// Logout user and destroy session
async function logout(req, res, next) {
  req.logout((err) => {
    if (err) return next(err);

    req.session.destroy((err) => {
      if (err) return next(err);

      res.render('home', { user: { firstname: 'User', email: 'Not logged in' } });
    });
  });
}

// View all courses for users
async function getCourses(req, res) {
  try {
    const [rows] = await db.query('SELECT * FROM courses');
    res.render('usercourse', { courses: rows });
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).send('Server Error');
  }
}

// View courses created or enrolled by the logged-in user
async function getMyCourses(req, res) {
  try {
    const userId = req.user.id; // Assuming req.user has user data
    const [rows] = await db.query('SELECT * FROM courses WHERE user_id = ?', [userId]);
    res.render('mycourses', { courses: rows });
  } catch (error) {
    console.error('Error fetching user courses:', error);
    res.status(500).send('Server Error');
  }
}

module.exports = {
  register,
  login,
  home,
  logout,
  getCourses,
  getMyCourses,
};
// This code handles user registration, login, logout, and fetching courses for users.
// It uses a User model for database interactions and includes error handling for various operations.
// It also provides functions to render the home page and user courses, ensuring that the user is authenticated before accessing certain routes.