const JobApplied = require("../models/jobApplied.model");
const mognoose = require("mongoose");

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
      select: "fullname",
    },
  });
  return job;
}

// async function getContractorApplication(contractorId){
//   const application = await JobApplied.find()
  
// }

module.exports = {
  applyJob,
  getUserApplication,
  // getContractorApplication,
};
