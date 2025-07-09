const Notification = require('../models/NotificationModel')

exports.createNotification = async (req, res) => {
  try {
    const { userId, message, type } = req.body;
    const notification = new Notification({ userId, message, type });
    await notification.save();
    res.status(201).json(notification);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getNotificationsByUser = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.params.userId }).sort({ timestamp: -1 });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const updated = await Notification.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUnreadNotificationsByUser = async (req, res) => {
  try {
    const unread = await Notification.find({ userId: req.params.userId, read: false });
    res.json(unread);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};