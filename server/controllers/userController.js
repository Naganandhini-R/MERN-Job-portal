import JobApplication from "../models/jobApplication.js";
import Job from "../models/job.js";
import User from "../models/User.js";
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";
import SavedJob from '../models/savedJob.js';

// Save / Unsave Job
export const saveJob = async (req, res) => {
  try {
    const { jobId } = req.body;
    const userId = req.auth.userId;

    const existing = await SavedJob.findOne({ userId, jobId });
    if (existing) {
      await SavedJob.deleteOne({ _id: existing._id });
      return res.json({ success: true, message: "Job unsaved" });
    }

    const saved = await SavedJob.create({ userId, jobId });
    res.json({ success: true, message: "Job saved", saved });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get all saved jobs
export const getSavedJobs = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const savedJobs = await SavedJob.find({ userId }).populate("jobId");

    res.json({ success: true, jobs: savedJobs });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};



// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 🔹 Sync Clerk user to MongoDB
export const syncUser = async (req, res) => {
  try {
    const { clerkId, name, email, image } = req.body;
    if (!clerkId) {
      return res.status(400).json({ success: false, message: "Clerk ID is required" });
    }

    let user = await User.findOne({ clerkId });
    if (!user) {
      user = await User.create({
        clerkId,
        name: name || "Unknown User",
        email: email || "noemail@example.com",
        image: image || "https://via.placeholder.com/150",
        resume: ""
      });
    } else {
      user.name = name || user.name;
      user.email = email || user.email;
      user.image = image || user.image;
      await user.save();
    }

    res.json({ success: true, user });
  } catch (error) {
    console.error("syncUser error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// 🔹 Get user data
export const getUserData = async (req, res) => {
  try {
    const clerkId = req.auth?.userId;
    if (!clerkId) return res.status(401).json({ success: false, message: "Unauthorized" });

    let user = await User.findOne({ clerkId });
    if (!user) {
      user = await User.create({
        clerkId,
        name: "Unnamed User",
        email: "noemail@example.com",
        image: "https://via.placeholder.com/150",
        resume: ""
      });
    }

    res.json({ success: true, user });
  } catch (err) {
    console.error("getUserData error:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// 🔹 Get user job applications
export const getUserJobApplications = async (req, res) => {
  try {
    const clerkId = req.auth?.userId;
    if (!clerkId) return res.status(401).json({ success: false, message: "Unauthorized" });

    const user = await User.findOne({ clerkId });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const applications = await JobApplication.find({ userId: user._id })
      .populate("companyId", "name email image")
      .populate("jobId", "title description location category level salary")
      .populate("userId", "name email image resume")
      .sort({ date: -1 });

    res.json({ success: true, applications });
  } catch (err) {
    console.error("getUserJobApplications error:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// 🔹 Apply for job
export const applyForJob = async (req, res) => {
  try {
    const clerkId = req.auth?.userId;
    const { jobId } = req.body;

    if (!clerkId || !jobId) {
      return res.status(400).json({ success: false, message: "Job ID and User ID required" });
    }

    const user = await User.findOne({ clerkId });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const existing = await JobApplication.findOne({ jobId, userId: user._id });
    if (existing) return res.status(400).json({ success: false, message: "Already applied" });

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ success: false, message: "Job not found" });

    const application = await JobApplication.create({
      companyId: job.companyId,
      userId: user._id,
      jobId: job._id,
      date: new Date()
    
    });

    res.status(201).json({ success: true, message: "Applied successfully", application });
  } catch (err) {
    console.error("applyForJob error:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// 🔹 Update Resume
export const updateUserResume = async (req, res) => {
  try {
    const clerkId = req.auth?.userId;
    const file = req.file;

    if (!clerkId) return res.status(401).json({ success: false, message: "Unauthorized" });
    if (!file) return res.status(400).json({ success: false, message: "Resume file required" });

    const user = await User.findOne({ clerkId });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    // Upload to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "job-portal/resumes",
          resource_type: "raw",
          format: "pdf"
        },
        (err, result) => (err ? reject(err) : resolve(result))
      );
      streamifier.createReadStream(file.buffer).pipe(stream);
    });

    user.resume = uploadResult.secure_url;
    await user.save();

    res.json({ success: true, message: "Resume uploaded", user });
  } catch (err) {
    console.error("updateUserResume error:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};




