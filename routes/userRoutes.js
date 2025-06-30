const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController'); // Ensure the path is correct

// Login route
router.get('/login', userController.getLogin); // Get login page
router.post('/login', userController.login); // Post login form

// Register route
router.get('/register', userController.getRegister); // Get register page
router.post('/register', userController.register); // Post register form

// Logout route
router.get('/logout', userController.logout); // Logout user
router.get('/home', userController.home); // Home page after login
router.get('/usercourse', userController.getCourses);



module.exports = router;
