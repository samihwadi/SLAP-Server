const express = require('express');
const { createAssignment, getAssignments, submitAssignment, getSubmissions } = require('../controllers/assignmentController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

// Route to create an assignment
router.post('/create-assignment', createAssignment);
// Route to get assignments
router.get('/courses/:courseId/assignments', getAssignments);
// Route to submit an assignment with file upload
router.post('/submit', authMiddleware, upload.single('file'), submitAssignment);
// Route to get logged in user submissions for a specific assignment
router.get('/assignments/:assignmentId/submissions', authMiddleware, getSubmissions);

module.exports = router;
