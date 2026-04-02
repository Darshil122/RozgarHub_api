const express = require('express');
const router = express.Router();
const { GetNotification, MarkAsRead, MarkAllAsRead } = require('../apis/notification.api');

router.put("/markAll", MarkAllAsRead);
router.get("/", GetNotification);
router.put("/:id", MarkAsRead);

module.exports = router;