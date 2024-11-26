const authMiddleware = require('../middleware/authMiddleware');
const express = require('express');
const router = express.Router();
const { login, userRegister, logout, getProfile, getAllUsers } = require('../controllers/authController');

// Routes
router.post('/register', userRegister)
router.post('/login', login);
router.post('/logout', logout);
router.get('/profile', getProfile);
// Add this route
router.get("/users", authMiddleware, getAllUsers);





module.exports = router;
