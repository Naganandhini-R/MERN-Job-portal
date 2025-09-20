import SavedJob from "../models/savedJob.js";

// Save / Unsave Job (toggle)
export const toggleSaveJob = async (req, res) => {
  try {
    const { jobId } = req.body;
    const userId = req.auth.userId; // Clerk user ID

    if (!jobId || !userId) {
      return res
        .status(400)
        .json({ success: false, message: "Job ID and User ID required" });
    }

    // Check if job already saved
    const existing = await SavedJob.findOne({ userId, jobId });

    if (existing) {
      // If already saved → unsave
      await SavedJob.deleteOne({ _id: existing._id });
      return res.json({ success: true, message: "Job unsaved" });
    }

    // Else → save
    const savedJob = await SavedJob.create({ userId, jobId });
    return res.json({ success: true, message: "Job saved", savedJob });
  } catch (error) {
    console.error("toggleSaveJob error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 🔹 Get all saved jobs for user
export const getSavedJobs = async (req, res) => {
  try {
    const userId = req.auth.userId;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    // Populate jobId and companyId
    const savedJobs = await SavedJob.find({ userId }).populate({
      path: "jobId",
      populate: { path: "companyId" },
    });

    res.json({ success: true, jobs: savedJobs });
  } catch (error) {
    console.error("getSavedJobs error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
