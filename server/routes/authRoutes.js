// routes/auth.js
const express = require('express');
const router = express.Router();
const { login, userRegister, logout, getProfile } = require('../controllers/authController');

// Routes
router.post('/register', userRegister)
router.post('/login', login);
router.post('/logout', logout);
router.get('/profile', getProfile);





module.exports = router;
