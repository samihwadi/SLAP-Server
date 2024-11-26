const {hashPassword, comparePassword} = require('../helper/auth')
const User = require('../models/User');
const Message = require('../models/Message');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const changePassword = async (req, res) => {
   const { oldPassword, newPassword } = req.body;

   try {
      if (!newPassword || newPassword.length < 8){
        return res.json({
            error: 'Password should be at least 8 characters'
        })
      }
      const user = await User.findById(req.user.id);
      if (!user) return res.status(404).json({ error: 'User not found' });

      const isMatch = await comparePassword(oldPassword, user.password)
      if (!isMatch) return res.status(400).json({ error: 'Incorrect old password' });

      const hashedPassword = await hashPassword(newPassword)
      user.password = hashedPassword
      await user.save();
      res.json({ message: 'Password updated successfully' });
   } catch (err) {
      res.status(500).json({ error: 'Server error' });
   }
};

const requestPasswordReset = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'User not found' });
        }

        // Generate a new temporary password
        const newPassword = crypto.randomBytes(6).toString('hex');

        // Hash the new password
        const hashedPassword = await hashPassword(newPassword);
        user.password = hashedPassword;
        await user.save();

        // Send email with new password
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            to: user.email,
            from: process.env.EMAIL_USER,
            subject: 'Password Reset',
            text: `Your password has been reset. Your new temporary password is: ${newPassword}\n\n
                   Please log in and change your password immediately.`,
        };

        transporter.sendMail(mailOptions, (err) => {
            if (err) {
                return res.status(500).json({ message: 'Error sending email' });
            }
            res.status(200).json({ message: 'Password reset email sent' });
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Send Message
const sendMessage = async (req, res) => {
    try {
        const { senderId, recipientEmail, content, isBroadcast } = req.body;
    
        if (!content || !senderId || (!recipientEmail && !isBroadcast)) {
          return res.status(400).json({ error: 'Missing required fields.' });
        }
    
        // Find the recipient by email
        let recipient = null;
        if (!isBroadcast) {
          recipient = await User.findOne({ email: recipientEmail });
          if (!recipient) {
            return res.status(404).json({ error: 'Recipient email not found.' });
          }
        }
    
        // Create the message
        const message = new Message({
          sender: senderId,
          recipients: isBroadcast ? [] : [recipient._id],
          content,
          isBroadcast,
        });
    
        await message.save();
        res.status(201).json({ message: 'Message sent successfully.', message });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error.' });
    }
}

// Viewing Messages
const viewMessage = async (req, res) => {
    try {
        const { recipientId } = req.params;
    
        const messages = await Message.find({
          $or: [
            { recipients: recipientId }, // Direct messages
            { isBroadcast: true }, // Broadcast messages
          ],
        }).populate('sender', 'name email').sort({ createdAt: -1 });
    
        res.status(200).json({ messages });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
module.exports = {sendMessage, viewMessage, requestPasswordReset, changePassword}
