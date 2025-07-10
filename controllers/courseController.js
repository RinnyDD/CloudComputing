const db = require('../models/db');

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

  console.log('File received:', req.file);

  if (req.file && req.file.location) {
    // multerS3 adds the 'location' field containing the full S3 URL
    image_path = req.file.location;
  } else {
    console.log('No image uploaded');
  }

  try {
    if (!title || !description || !author || !price) {
      return res.status(400).send('All fields are required.');
    }

    console.log('Inserting course data:', { title, description, author, price, image_path });

    await db.query(
      'INSERT INTO courses (title, description, author, price, image) VALUES (?, ?, ?, ?, ?)',
      [title, description, author, price, image_path]
    );

    res.redirect('/courses');
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
  const { title, description, author, price } = req.body;

  let image_path = req.body.image || "";  // Use existing image URL if no new file uploaded

  if (req.file && req.file.location) {
    image_path = req.file.location;
  }

  try {
    await db.query(
      'UPDATE courses SET title = ?, description = ?, author = ?, price = ?, image = ? WHERE id = ?',
      [title, description, author, price, image_path, courseId]
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

// View a specific course by ID
exports.getCourseById = async (req, res) => {
  const courseId = req.params.id;
  try {
    const [rows] = await db.query('SELECT * FROM courses WHERE id = ?', [courseId]);
    if (rows.length === 0) {
      return res.status(404).send('Course not found');
    }
    res.render('courseDetails', { course: rows[0] });
  } catch (error) {
    console.error('Error fetching course:', error);
    res.status(500).send('Server Error');
  }
};
