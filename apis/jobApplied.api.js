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

// async function GetContractorApplication(req, res){
//   try{
//     const contractorId = req.user.id;
//     const result = await jobAppliedService.getContractorApplication(contractorId);
//     res.status(200).json({jobs: result});
//   }catch(error){
//     res.status(500).json({message: error.message});
//   }
// }


module.exports = {
  ApplyJob,
  GetUserApplication,
  // GetContractorApplication
};