const express = require('express');
const router = express.Router();
const { GetNotification, MarkAsRead, MarkAllAsRead } = require('../apis/notification.api');

router.get("/", GetNotification);
router.put("/markAll", MarkAllAsRead);
router.put("/:id", MarkAsRead);

module.exports = router;