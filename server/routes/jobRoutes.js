import express from 'express';
import { getJobs, getJobById, getAllJobs } from '../controllers/jobcontroller.js';

const router = express.Router();

// Get all visible jobs
router.get('/', getJobs);

// backend/routes/job.js
router.get("/count", async (req, res) => {
  try {
    const count = await Job.countDocuments(); // count number of jobs
    res.json({ total: count });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Get all jobs (no visibility filter, e.g. for admin)
router.get('/all', getAllJobs);

// Get a single job by ID
router.get('/:id', getJobById);

export default router;
