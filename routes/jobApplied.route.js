const express = require('express');
const router = express.Router();
const permit = require("../middleware/authorization");
const { ApplyJob, GetUserApplication } = require('../apis/jobApplied.api');

router.post("/:jobId", permit("worker"), ApplyJob);
router.get("/", permit("worker"), GetUserApplication);

module.exports = router;