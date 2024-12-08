const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // User reference
  isRead: { type: Boolean, default: false },
  type: { type: String, enum: ['low_stock', 'expiration', 'custom'], default: 'custom' },
  createdAt: { type: Date, default: Date.now },
}
, {
  timestamps: true
}
);

const NotificationModel = mongoose.model('Notification', notificationSchema);

module.exports = NotificationModel;

