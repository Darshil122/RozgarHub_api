const JobApplied = require("../models/jobApplied.model");
const mongoose = require("mongoose");

async function applyJob(userId, jobId) {
  const alreadyApplied = await JobApplied.findOne({ userId, jobId });

  if (alreadyApplied) {
    throw new Error("You already applied for this job");
  }

  const application = new JobApplied({
    userId,
    jobId,
  });

  return await application.save();
}

async function getUserApplication(userId) {
  const job = await JobApplied.find({ userId }).populate({
    path: "jobId",
    populate: {
      path: "created_By",
      select: "fullname contact",
    },
  });
  return job;
}

async function getJobApplication(jobId){
  if(!mongoose.Types.ObjectId.isValid(jobId)){
    throw new Error("Invalid Job Id");
  }

  const application = await JobApplied.find({jobId})
  .populate("userId", "fullname contact email")
  .populate("jobId", "job_title");

  return application;
}

async function updateApplicationStatus(applicationId, status){
  const application = await JobApplied.findById(applicationId);

  if(!application){
    throw new Error("Job Application not found");
  }

  application.status = status;
  await application.save();
  return application;
}

module.exports = {
  applyJob,
  getUserApplication,
  getJobApplication,
  updateApplicationStatus,
};
