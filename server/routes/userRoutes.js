const express = require('express');
const { sendMessage, viewMessage, requestPasswordReset, changePassword } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.put('/change-password', authMiddleware, changePassword);
router.post('/request-password-reset', requestPasswordReset);
router.post('/messages', sendMessage);
router.get('/messages/:recipientId', viewMessage);
module.exports = router;
