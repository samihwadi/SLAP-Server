// middleware/uploadMiddleware.js
const multer = require('multer');
const path = require('path');

// Configure multer storage
const storage = multer.diskStorage({
   destination: (req, file, cb) => {
      cb(null, 'uploads/'); // Specify the folder to store uploaded files
   },
   filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`); // Rename file to avoid name conflicts
   }
});

// Set up multer middleware
const upload = multer({ storage });

module.exports = upload;
