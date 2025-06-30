const multer = require('multer');
const path = require('path');

// Configure storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../public/img')); // Directory to save images
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname); // Ensure unique filenames
    }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Optional: Set a size limit (e.g., 10MB)
}).single('image');

module.exports = upload;
