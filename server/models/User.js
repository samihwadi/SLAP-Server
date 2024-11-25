const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { 
        type: String, required: true 
    },
    email: { 
        type: String, unique: true, required: true 
    },
    password: { 
        type: String, required: true 
    },
    role: { 
        type: String, enum: ['student', 'instructor', 'admin'], required: true 
    },
    courses: [{ 
        type: mongoose.Schema.Types.ObjectId, ref: 'Course' 
    }], 
    createdAt: { 
        type: Date, default: Date.now 
    },
  });
module.exports = mongoose.model('User', UserSchema);