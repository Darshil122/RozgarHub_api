const express = require('express');
const router = express.Router();
const { GetNotification } = require('../apis/notification.api');

router.get("/", GetNotification);

module.exports = router;