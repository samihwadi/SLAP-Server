const Course = require('../models/Course');
const User = require('../models/User');

const getCourses = async (req, res) => {
    try {
      const userId = req.user.id; 
      const userRole = req.user.role;
  
      let courses;
      if (userRole === 'student') {
        courses = await Course.find({ students: userId }).select('courseCode courseName'); // Fetch courses for students
      } else if (userRole === 'instructor') {
        courses = await Course.find({ instructor: userId }).select('courseCode courseName'); // Fetch courses for instructors
      } else if (userRole === 'admin') {
        courses = await Course.find().select('courseCode courseName'); // Admin can see all courses
      } else {
        return res.status(403).json({ error: 'Access denied' });
      }
  
      res.status(200).json(courses);
    } catch (err) {
      console.error('Error fetching courses:', err);
      res.status(500).json({ error: 'Server error' });
    }
};  

const addCourses = async (req, res) => {
    try {
        const { courseCode, courseName, description, instructorID, studentIDs } = req.body;

        // Find the instructor by email
        const instructor = await User.findOne({ email: instructorID });
        if (!instructor || instructor.role !== 'instructor') {
            return res.status(400).json({ error: 'Invalid instructor email' });
        }

        // Find students by emails
        const students = await User.find({ email: { $in: studentIDs }, role: 'student' });
        if (students.length !== studentIDs.length) {
            return res.status(400).json({ error: 'Some student emails are invalid or not students' });
        }

        // Create the course
        const course = new Course({
            courseCode,
            courseName,
            description,
            instructor: instructor._id, // Use the ObjectId from the instructor
            students: students.map((student) => student._id), // Use ObjectIds from the students
        });

        await course.save();

        // Update the instructor's courses
        instructor.courses.push(course._id);
        await instructor.save();

        // Update each student's courses
        for (const student of students) {
            student.courses.push(course._id);
            await student.save();
        }

        res.status(201).json(course);
    } catch (err) {
        console.error('Error adding course:', err);
        res.status(500).json({ error: 'Server error' });
    }
};

const updateCourse = async (req, res) => {
    try {
        const { courseCode, addStudents = [], removeStudents = [] } = req.body;

        // Find the course by courseCode
        const course = await Course.findOne({ courseCode });
        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }

        // Add students
        if (addStudents.length > 0) {
            const studentsToAdd = await User.find({ email: { $in: addStudents }, role: 'student' });
            if (studentsToAdd.length !== addStudents.length) {
                return res.status(400).json({ error: 'Some student emails are invalid or not students' });
            }

            // Add to course
            const newStudentIds = studentsToAdd.map((student) => student._id).filter((id) => !course.students.includes(id));
            course.students.push(...newStudentIds);

            // Update each student's courses
            for (const student of studentsToAdd) {
                if (!student.courses.includes(course._id)) {
                    student.courses.push(course._id);
                    await student.save();
                }
            }
        }

        // Remove students
        if (removeStudents.length > 0) {
            const studentsToRemove = await User.find({ email: { $in: removeStudents }, role: 'student' });
            const studentIdsToRemove = studentsToRemove.map((student) => student._id);

            // Remove from course
            course.students = course.students.filter((id) => !studentIdsToRemove.includes(id));

            // Update each student's courses
            for (const student of studentsToRemove) {
                student.courses = student.courses.filter((courseId) => !courseId.equals(course._id));
                await student.save();
            }
        }

        // Save the updated course
        await course.save();

        res.status(200).json({ message: 'Course updated successfully', course });
    } catch (err) {
        console.error('Error updating course:', err);
        res.status(500).json({ error: 'Server error' });
    }
};



module.exports = {getCourses, addCourses, updateCourse};

