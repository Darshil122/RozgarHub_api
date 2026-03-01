const jobModel = require("../models/job.model");
const mongoose = require("mongoose");

async function createJob(jobData, userId) {
  const { job_title, job_desc, contact, pay_per_day, number_of_persons } =
    jobData;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid user ID");
  }

  const newJob = new jobModel({
    job_title,
    job_desc,
    created_By: userId,
    contact,
    number_of_persons,
    pay_per_day,
  });

  await newJob.save();
  return newJob;
}

async function getAllJob(userId) {
  const query = { deleted: false, created_By: userId };
  const job = await jobModel.find(query).populate("created_By", "fullname");
  return job;
}

async function getJobById(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid job ID");
  }
  const job = await jobModel.findById(id).populate("created_By", "fullname");
  return job;
}
async function updatedJob(jobData, id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid job ID");
  }
  const { job_title, job_desc, contact,number_of_persons, pay_per_day } = jobData;

  const updatedJob = await jobModel.findByIdAndUpdate(
    id,
    {
      job_title,
      job_desc,
      contact,
      number_of_persons,
      pay_per_day,
    },
    { new: true, runValidators: true },
  );

  return updatedJob;
}

async function deletedJob(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid job ID");
  }

  const job = await jobModel.findOne({
    _id: id,
    deleted: false,
  });
  if (!job) {
    throw new Error("Job not found");
  }

  job.deleted = true;
  await job.save();
  return true;
}

module.exports = {
  createJob,
  getAllJob,
  getJobById,
  updatedJob,
  deletedJob,
};
