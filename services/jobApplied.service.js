const JobApplied = require("../models/jobApplied.model");
const redis = require("../config/redis");
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

  const savedApp = await application.save();

  await redis.del(`user_applications:${userId}`);
  await redis.del(`job_applications:${jobId}`);

  return savedApp;
}

async function getUserApplication(userId) {
  const cacheKey = `user_applications:${userId}`;
  const cachedData = await redis.get(cacheKey);
  if(cachedData){
      return JSON.parse(cachedData);
  }
  const job = await JobApplied.find({ userId }).populate({
    path: "jobId",
    populate: {
      path: "created_By",
      select: "fullname contact",
    },
  });
  await redis.set(cacheKey, JSON.stringify(job), "EX", 60);
  return job;
}

async function getJobApplication(jobId){
  if(!mongoose.Types.ObjectId.isValid(jobId)){
    throw new Error("Invalid Job Id");
  }
  const cacheKey = `job_applications:${jobId}`;
  const cachedData = await redis.get(cacheKey);

  if (cachedData) {
    return JSON.parse(cachedData);
  }

  const application = await JobApplied.find({jobId})
  .populate("userId", "fullname contact email")
  .populate("jobId", "job_title");

   await redis.set(cacheKey, JSON.stringify(application), "EX", 60);

  return application;
}

async function updateApplicationStatus(applicationId, status){
  const application = await JobApplied.findById(applicationId);

  if(!application){
    throw new Error("Job Application not found");
  }

  application.status = status;
  await application.save();
  await redis.del(`user_applications:${application.userId}`);
  await redis.del(`job_applications:${application.jobId}`);
  return application;
}

module.exports = {
  applyJob,
  getUserApplication,
  getJobApplication,
  updateApplicationStatus,
};
