const Job = require("../models/job.model");
const JobApplied = require("../models/jobApplied.model");
const User = require("../models/user.model");
const Group = require("../models/groupChat.model");
const jobAppliedService = require("../services/jobApplied.service");
const {
  workerNotification,
  contractorNotification,
} = require("../services/notification.service");
const { getIo } = require("../socket/socket");
const { getReceiverSocketId } = require("../socket/socketHandler");

async function ApplyJob(req, res) {
  try {
    const userId = req.user.id;
    const { jobId } = req.params;

    // apply job
    const result = await jobAppliedService.applyJob(userId, jobId);

    //create notification
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    const contractorId = await job.created_By;
    const user = await User.findById(userId);

    await workerNotification(
      userId,
      contractorId,
      jobId,
      user?.fullname,
      job?.job_title,
    );

    res.status(201).json({ message: "Job Applied successfully", job: result });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function GetUserApplication(req, res) {
  try {
    const userId = req.user.id;
    const result = await jobAppliedService.getUserApplication(userId);

    res.status(200).json({ jobs: result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function GetJobApplication(req, res) {
  try {
    const jobId = req.params.id;
    const result = await jobAppliedService.getJobApplication(jobId);
    res.status(200).json({ jobs: result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function UpdateApplicationStatus(req, res) {
  try {
    const applicationId = req.params.id;
    const contractorId = req.user.id;

    const { status } = req.body;
    // update status
    const result = await jobAppliedService.updateApplicationStatus(
      applicationId,
      status,
    );
    // update status create notification
    const application = await JobApplied.findById(applicationId);
    if (!application) {
      res.status(404).json({ message: "Application not found" });
    }
    const workerId = application.userId;
    const jobId = application.jobId;

    const job = await Job.findById(jobId);

    // login for notification
    await contractorNotification({
      senderId: contractorId,
      receiverId: workerId,
      jobId: jobId,
      type: "update_status",
      message: `Your application for ${job.job_title || "a job"} has been ${status}`,
    });

    // logic for group create
    const io = getIo;
    const workerSocketId = getReceiverSocketId(workerId);

    if (workerSocketId) {
      io.to(workerSocketId).emit("applicationStatusUpdated", {
        jobId,
        status,
      });
    }

    if (status === "accept") {
      let group = await Group.findOne({ jobId });

      if (!group) {
        group = await Group.create({
          jobId,
          contractorId,
          groupName: `${job.job_title}`,
          members: [contractorId, workerId],
        });
      } else {
        if (!group.members.includes(workerId)) {
          group.members.push(workerId);
          await group.save();
        }
      }

      if (workerSocketId) {
        io.to(workerSocketId).emit("addedToGroup", {
          groupId: group._id,
          groupName: group.groupName,
        });
      }
    }

    res
      .status(200)
      .json({ message: "Job application status updated", app: result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  ApplyJob,
  GetUserApplication,
  GetJobApplication,
  UpdateApplicationStatus,
};
