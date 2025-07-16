const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const upload = require('../config/multerS3'); // multer configuration for file uploads
require("dotenv").config({ path: __dirname + "/../.env" });

// User credentials
const userDatabase = {
  username: process.env.ADMIN_USERNAME,
  password: process.env.ADMIN_PASSWORD,
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
  res.render('adminlogin');
});

// Handle login request
router.post('/adminlogin', async (req, res) => {
  const { username, password } = req.body;
  if (username === userDatabase.username && password === userDatabase.password) {
    req.session.user = { username };
    res.redirect('/courses');
  } else {
    res.render('adminlogin', {
      error: 'Invalid username or password',
      messages: { error: ['Login Failed! Please check your credentials.'] },
    });
  }
});

// Protect all /courses* routes
router.use('/courses', isAuthenticated);

// View all courses
router.get('/courses', courseController.getCourses);

router.get('/courses/create', courseController.getCreateForm);
router.post(
  '/courses/create',
  upload.single('image'),  // multer middleware for single file upload with field name 'image'
  courseController.createCourse
);
// View a specific course
router.get('/courses/:id', courseController.getCourseById);
// Create a course


// Edit a course
router.get('/courses/edit/:id', courseController.getEditForm);
router.post(
  '/courses/edit/:id',
  upload.single('image'),
  courseController.updateCourse
);
// Delete a course
router.post('/courses/delete/:id', courseController.deleteCourse);

module.exports = router;
