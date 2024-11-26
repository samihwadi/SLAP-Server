const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser')
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');
const userRoutes = require('./routes/userRoutes'); // Import user routes
const assignmentRoutes = require('./routes/assignmentRoutes'); // Import assignment routes
const dotenv = require('dotenv')
const path = require('path')
dotenv.config();

const app = express();

// Middleware
app.use(cors({
    origin: 'http://localhost:5173', 
    credentials: true
}));
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({extended: false}))
// Serve files in the 'uploads' directory at the '/uploads' route
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/auth', courseRoutes);
app.use('/api/auth', userRoutes); 
app.use('/api/auth', assignmentRoutes);


// Database connection
const PORT = process.env.PORT || 5001

mongoose.connect(process.env.MONGO_URL)
.then(() => {
        app.listen(PORT, () => {
            console.log(`Listening on port ${PORT}`)
        })
    })
    .catch((err) => {
        console.log(err)
    })
