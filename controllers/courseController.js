const db = require('../models/db');
const upload = require('../config/multer');

// View all courses
exports.getCourses = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM courses');
    res.render('courses', { courses: rows });
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).send('Server Error');
  }
};

// Render create course form
exports.getCreateForm = (req, res) => {
  res.render('create');
};

// Handle creating a course
exports.createCourse = async (req, res) => {
  const { title, description, author, price } = req.body;
  
  let image_path = "";

  // Log to check if the image was received
  console.log('File received:', req.file);

  if (req.file) {
    image_path = `/img/${req.file.filename}`;  // Correct path for the uploaded image
  } else {
    console.log('No image uploaded');
  }

  try {
    // Check if all required fields are present
    if (!title || !description || !author || !price) {
      return res.status(400).send('All fields are required.');
    }

    // Log the data to be inserted
    console.log('Inserting course data:', { title, description, author, price, image_path });

    // Insert the course into the database
    await db.query(
      'INSERT INTO courses (title, description, author, price, image) VALUES (?, ?, ?, ?, ?)',
      [title, description, author, price, image_path]
    );

    res.redirect('/courses');  // Redirect to the homepage or courses page after successful creation
  } catch (error) {
    console.error('Error creating course:', error);
    res.status(500).send('Server Error');
  }
};


// Render edit course form
exports.getEditForm = async (req, res) => {
  const courseId = req.params.id;
  try {
    const [rows] = await db.query('SELECT * FROM courses WHERE id = ?', [courseId]);
    res.render('edit', { course: rows[0] });
  } catch (error) {
    console.error('Error fetching course:', error);
    res.status(500).send('Server Error');
  }
};

// Handle updating a course
exports.updateCourse = async (req, res) => {
  const courseId = req.params.id;
  const { title, description, author, price, image } = req.body;
  try {
    await db.query(
      'UPDATE courses SET title = ?, description = ?, author = ?, price = ?, image = ? WHERE id = ?',
      [title, description, author, price, image, courseId]
    );
    res.redirect('/courses');
  } catch (error) {
    console.error('Error updating course:', error);
    res.status(500).send('Server Error');
  }
};

// Handle deleting a course
exports.deleteCourse = async (req, res) => {
  const courseId = req.params.id;
  try {
    await db.query('DELETE FROM courses WHERE id = ?', [courseId]);
    res.redirect('/courses');
  } catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).send('Server Error');
  }
};
