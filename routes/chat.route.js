const express = require("express");
const { getMyGroups, getMessages, getGroupDetails } = require("../apis/chat.api");
const router = express.Router();

router.get("/group/my-groups", getMyGroups);
router.get("/message/:groupId", getMessages);
router.get("/group/:groupId", getGroupDetails);

module.exports = router;