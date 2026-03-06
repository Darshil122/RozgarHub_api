const mongoose = require("mongoose");
const User = require("./user.model");
const Job = require("./job.model");

const jobAppliedSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User,
      required: true,
    },
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Job,
      required: true,
    },
  },
  {
    timeStamps: true,
  },
);

const JobApplied = mongoose.model("JobApplied", jobAppliedSchema);
module.exports = JobApplied; 
