const express = require('express');
const router = express.Router();
const permit = require("../middleware/authorization");
const {
  ApplyJob,
  GetUserApplication,
  GetJobApplication,
  UpdateApplicationStatus,
} = require("../apis/jobApplied.api");

router.post("/:jobId", permit("worker"), ApplyJob);
router.get("/", permit("worker"), GetUserApplication);
router.get("/:id", permit("contractor"), GetJobApplication);
router.put("/:id", permit("contractor"), UpdateApplicationStatus);

module.exports = router;