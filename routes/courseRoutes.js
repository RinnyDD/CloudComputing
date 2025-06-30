const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const upload = require('../config/multer');

// User credentials
const userDatabase = {
  username: 'Admin',
  password: 'Course168',
};

// Middleware for checking if the user is logged in
function isAuthenticated(req, res, next) {
  if (req.session && req.session.user) {
    return next();
  } else {
    return res.redirect('/adminlogin');
  }
}

// Show login page
router.get('/adminlogin', (req, res) => {
  res.render('adminlogin'); // Assuming you have a 'login.ejs' view
});

// Handle login request
router.post('/adminlogin', async (req, res) => {
  const { username, password } = req.body;

  if (username === userDatabase.username && password === userDatabase.password) {
    // Store user session
    req.session.user = { username };
    res.redirect('/courses'); // Redirect to courses page after successful login
  } else {
    res.render('adminlogin', {
      error: 'Invalid username or password',
      messages: { error: ['Login Failed! Please check your credentials.'] },
    });
  }
});

// View all courses
router.get('/courses', isAuthenticated, courseController.getCourses);

// Create a course
router.get('/courses/create', isAuthenticated, courseController.getCreateForm);
router.post(
  '/courses/create',
  isAuthenticated,
  (req, res, next) => {
    upload(req, res, (err) => {
      if (err) {
        console.error('Multer Error:', err);
        return res.status(500).send('File upload error');
      }
      next();
    });
  },
  courseController.createCourse
);

// Edit a course
router.get('/courses/edit/:id', isAuthenticated, courseController.getEditForm);
router.post('/courses/edit/:id', isAuthenticated, courseController.updateCourse);

// Delete a course
router.post('/courses/delete/:id', isAuthenticated, courseController.deleteCourse);

module.exports = router;
