const mongoose = require('mongoose');

const AssignmentSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    dueDate: { type: Date, required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    instructions: {
      fileName: { type: String }, // Original file name
      filePath: { type: String, required: true }, // Path to the file on the server or cloud storage
      fileType: { type: String, enum: ['pdf', 'txt'], required: true }, // File type restriction
    },
    submissions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Submission' }],
    createdAt: { type: Date, default: Date.now },
  });
  
module.exports = mongoose.model('Assignment', AssignmentSchema);
