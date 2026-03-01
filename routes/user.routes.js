const express = require("express");
const router = express.Router();
const {RegisterUser, LoginUser, getMe} = require("../apis/user.api");
const authentication = require("../middleware/authentication");

router.post("/signup", RegisterUser);
router.post("/signin", LoginUser);
router.get("/me", authentication, getMe);

module.exports = router;