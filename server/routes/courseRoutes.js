const express = require('express');
const router = express.Router();
const { getCourses, addCourses, updateCourse } = require('../controllers/courseController');
const authMiddleware = require('../middleware/authMiddleware');

// Route to get courses
router.get('/show-courses', authMiddleware, getCourses);

// Route to add a courses
router.post('/courses', addCourses);

// Route to update a course
router.post('/update-course', updateCourse);


module.exports = router;
