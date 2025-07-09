const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/NotificationController");

router.post("/", notificationController.createNotification);
router.get("/:userId/unread", notificationController.getUnreadNotificationsByUser);
router.get("/:userId", notificationController.getNotificationsByUser);
router.patch("/:id/read", notificationController.markAsRead);

module.exports = router;
