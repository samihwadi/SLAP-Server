const Submission = require('../models/Submission');
const Assignment = require('../models/Assignment');
const User = require('../models/User');
const Course = require('../models/Course');

// exports.submitAssignment = async (req, res) => {
//     const { assignmentId, studentSlapID } = req.body;
//     const submission = req.file ? req.file.path : null;

//     try {
//         // Validate that the assignment exists
//         const assignment = await Assignment.findById(assignmentId);
//         if (!assignment) {
//             return res.status(400).json({ error: 'Invalid assignment ID' });
//         }

//         // Validate that the student slapID exists
//         const student = await User.findOne({ slapID: studentSlapID });
//         if (!student) {
//             return res.status(400).json({ error: 'Invalid student slapID' });
//         }

//         // Create new submission document
//         const newSubmission = new Submission({
//             assignmentId,
//             studentSlapID,
//             submission,
//             submittedAt: Date.now()
//         });

//         await newSubmission.save();
//         res.status(201).json({ submission: newSubmission });
//     } catch (err) {
//         res.status(500).json({ error: 'Server error' });
//     }
// };

const submitAssignment = async (req, res) => {
    const { assignmentId } = req.body;
    const user = req.user; 

    try {
        const assignment = await Assignment.findById(assignmentId);
        if (!assignment) {
            return res.status(400).json({ error: 'Invalid assignment ID' });
        }

        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        // Create file URL
        const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

        // Save submission in the database
        const submission = new Submission({
            student: user.id,
            assignment: assignment._id,
            fileUrl,
        });

        await submission.save();

        // Add submission to the assignment
        assignment.submissions.push(submission._id);
        await assignment.save();

        res.status(201).json({ message: 'Submission successful', submission });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

const getSubmissions = async (req, res) => {
    const { assignmentId } = req.params;
  
    try {
      // Fetch only the submissions for the logged-in user
      const submissions = await Submission.find({
        assignment: assignmentId,
        student: req.user.id // Filter by the logged-in user's ID
      }).populate('student', 'name email');
  
      // If no submissions found, return an empty array
      if (submissions.length === 0) {
        return res.status(404).json({ message: 'No submissions found for this assignment.' });
      }
  
      res.status(200).json(submissions);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  };  


const createAssignment = async (req, res) => {
    const { courseCode, title, description, dueDate, instructions } = req.body;

    try {
        // Validate that the course code exists
        const course = await Course.findOne({ courseCode });
        if (!course) {
            return res.status(400).json({ error: 'Invalid course code' });
        }

        // Create new assignment document
        const assignment = new Assignment({
            title,
            description,
            dueDate: new Date(dueDate), 
            course: course._id, // Link the course by its ID
            instructions, // Expecting { fileName, filePath, fileType, fileSize }
        });

        // Save the assignment document
        await assignment.save();

        // Update the course document to include the assignment
        course.assignments.push(assignment._id);
        await course.save();

        res.status(201).json({ message: 'Assignment created successfully', assignment });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

const getAssignments = async (req, res) => {
    const { courseId } = req.params;

    try {
        const assignments = await Assignment.find({ course: courseId });
        if (assignments.length === 0) {
            return res.status(404).json({ message: 'No assignments found for this course.' });
        }
        res.status(200).json(assignments);
    } catch (err) {
        console.error('Error fetching assignments:', err);
        res.status(500).json({ error: 'Server error' });
    }
};

// exports.getAssignmentsByCourse = async (req, res) => {
//     const { courseCode } = req.params;

//     try {
//         // Validate that the course code exists
//         const course = await Course.findOne({ code: courseCode });
//         if (!course) {
//             return res.status(400).json({ error: 'Invalid course code' });
//         }

//         // Find assignments for the given course code
//         const assignments = await Assignment.find({ courseCode });
//         res.status(200).json(assignments);
//     } catch (err) {
//         res.status(500).json({ error: 'Server error' });
//     }
// };

module.exports = {createAssignment, getAssignments, submitAssignment, getSubmissions}