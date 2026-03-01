const jobService = require("../services/job.service");

async function CreatedJob(req, res) {
  try {
    const jobData = req.body;

    const userId = req.user.id;

    const newJob = await jobService.createJob(jobData, userId);

    return res
      .status(200)
      .json({ message: "Job Created Successfully", job: newJob });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function GetAllJob(req, res) {
  try {
    const userId = req.user.id;
    const jobs = await jobService.getAllJob(userId);
    return res.status(200).json({ job: jobs });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function GetJobById(req, res) {
  try {
    const { id } = req.params;

    const job = await jobService.getJobById(id);

    if (!id) {
      return res.statsu(404).json({ message: "Job not Found" });
    }

    return res.status(200).json({ job: job });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function UpdatedJob(req, res) {
  try {
    const jobData = req.body;
    const { id } = req.params;
    const updatedJob = await jobService.updatedJob(jobData, id);
    if (!updatedJob) {
      return res.status(404).json({ message: "Job not found" });
    }
    return res
      .status(200)
      .json({ message: "Job Updated Successfully", job: updatedJob });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function DeletedJob(req, res) {
  try {
    const { id } = req.params;

    await jobService.deletedJob(id);
    return res.status(200).json({ message: "Job deleted Successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

module.exports = { CreatedJob, GetAllJob, GetJobById, UpdatedJob, DeletedJob };
