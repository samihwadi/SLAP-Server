const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    recipients: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Empty for broadcast
    content: { type: String, required: true },
    isBroadcast: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
  });

module.exports = mongoose.model('Message', MessageSchema);

  