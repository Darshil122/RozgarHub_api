const jobModel = require("../models/job.model");
const mongoose = require("mongoose");

async function createJob(jobData, userId) {
  const {
    job_title,
    job_desc,
    location,
    pay_per_day,
    number_of_persons,
    job_closing_date,
    worker_required_date,
  } = jobData;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid user ID");
  }

  if (new Date(job_closing_date) > new Date(worker_required_date)) {
    throw new Error("Closing date must be before worker required date");
  }

  const newJob = new jobModel({
    job_title,
    job_desc,
    location,
    created_By: userId,
    number_of_persons,
    pay_per_day,
    job_closing_date,
    worker_required_date,
  });

  await newJob.save();
  return newJob;
}

async function getAllJob(userId) {
  const query = { deleted: false, created_By: userId };

  const jobs = await jobModel
    .find(query)
    .populate("created_By", "fullname contact");

  return jobs;
}

async function fetchJob() {
  const query = {
    deleted: false,
    job_closing_date: { $gte: new Date() },
  };

  const jobs = await jobModel
    .find(query)
    .populate("created_By", "fullname contact");

  return jobs;
}

async function getJobById(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid Job Id");
  }

  const job = await jobModel
    .findById(id)
    .populate("created_By", "fullname contact");

  if (!job || job.deleted) {
    throw new Error("Job not found");
  }

  return job;
}

async function updatedJob(jobData, id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid job ID");
  }

  const job = await jobModel.findById(id);

  if (!job) {
    throw new Error("Job not found");
  }

  if (new Date() > new Date(job.job_closing_date)) {
    throw new Error("Cannot update job after closing date");
  }

  const {
    job_title,
    job_desc,
    location,
    number_of_persons,
    pay_per_day,
    job_closing_date,
    worker_required_date,
  } = jobData;

  if (job_closing_date && worker_required_date) {
    if (new Date(job_closing_date) > new Date(worker_required_date)) {
      throw new Error("Closing date must be before worker required date");
    }
  }

  const updatedJob = await jobModel.findByIdAndUpdate(
    id,
    {
      job_title,
      job_desc,
      location,
      number_of_persons,
      pay_per_day,
      job_closing_date,
      worker_required_date,
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

  if (new Date() > new Date(job.job_closing_date)) {
    throw new Error("Cannot delete job after closing date");
  }

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
  fetchJob,
  getJobById,
  updatedJob,
  deletedJob,
};
