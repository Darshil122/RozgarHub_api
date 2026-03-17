const jobAppliedService = require("../services/jobApplied.service");

async function ApplyJob(req, res) {
  try {
    const userId = req.user.id;    
    const { jobId } = req.params;

    const result = await jobAppliedService.applyJob(userId, jobId);

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

async function GetJobApplication(req, res){
  try{
    const jobId = req.params.id;
    const result = await jobAppliedService.getJobApplication(jobId);
    res.status(200).json({jobs: result});
  }catch(error){
    res.status(500).json({message: error.message});
  }
}

async function UpdateApplicationStatus(req, res){
  try{
    const applicationId = req.params.id;
    const {status} = req.body;
    const result = await jobAppliedService.updateApplicationStatus(applicationId, status);
    res.status(200).json({message: "Job application status updated", app: result});
  }catch(error){
    res.status(500).json({message: error.message});
  }
}


module.exports = {
  ApplyJob,
  GetUserApplication,
  GetJobApplication,
  UpdateApplicationStatus,
};