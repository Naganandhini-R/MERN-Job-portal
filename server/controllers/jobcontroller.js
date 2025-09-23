import Job from "../models/job.js";
import Sentry from "../config/instrument.js";
import mongoose from "mongoose"; 

// Get all visible jobs
export const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ visible: true })
      .populate({ path: 'companyId', select: '-password' });

    res.json({ success: true, jobs });

  } catch (error) {
    Sentry.captureException(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

//  Get a single job by ID with ObjectId check
export const getJobById = async (req, res) => {
  const { id } = req.params;

  // Prevent invalid ObjectId crash
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid job ID format"
    });
  }

  try {
    const job = await Job.findById(id)
      .populate({ path: 'companyId', select: '-password' });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    res.json({ success: true, job });

  } catch (error) {
    Sentry.captureException(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all jobs (no visibility filter)
export const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find().populate("companyId");
    res.status(200).json({ success: true, jobs });
  } catch (error) {
    Sentry.captureException(error);
    res.status(500).json({ success: false, message: "Failed to fetch jobs" });
  }
};
