const express = require("express");
const router = express.Router();
const { CreatedJob, GetAllJob, GetJobById, UpdatedJob, DeletedJob } = require("../apis/job.api");
const permit = require("../middleware/authorization");


router.get("/", GetAllJob);
router.get("/:id", GetJobById);
router.post("/", permit("contractor"), CreatedJob);
router.put("/:id", permit("contractor"), UpdatedJob);
router.delete("/:id", permit("contractor"), DeletedJob);
module.exports = router;
