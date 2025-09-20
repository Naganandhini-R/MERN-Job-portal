import express from 'express';
import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';
import { toggleSaveJob, getSavedJobs } from '../controllers/savedJobController.js';

const router = express.Router();
const requireAuth = ClerkExpressRequireAuth();

router.post('/save-job', requireAuth, toggleSaveJob);
router.get('/saved-jobs/list', requireAuth, getSavedJobs);

export default router;
