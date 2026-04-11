const express = require("express");
const { getMyGroups, getMessages } = require("../apis/chat.api");
const router = express.Router();

router.get("/group/my-groups", getMyGroups);
router.get("/message/:groupId", getMessages);

module.exports = router;