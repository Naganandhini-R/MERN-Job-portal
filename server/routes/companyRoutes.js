import express from 'express';
import {
    updateJobApplicationStatus,
    ChangeVisibility, 
    getCompanyData,
    getCompanyJobApplicants,
    getCompanyPostedJobs,
    loginCompany,
    postJob,
    registerCompany,
    testEndpoint
} from '../controllers/companyController.js';
import { protectCompany } from '../middleware/authMiddleware.js';
import upload from '../config/multer.js';

const router = express.Router();

// Test endpoint for debugging (should be first)
router.post('/test', testEndpoint);

// Register a company
router.post('/register', upload.single('image'), registerCompany);

// Company login
router.post('/login', loginCompany);

// Get company data
router.get('/company', protectCompany, getCompanyData);

// Post a job
router.post('/post-job', protectCompany, postJob);

// Get applicants data of company
router.get('/applicants', protectCompany, getCompanyJobApplicants);

// Get company job list
router.get('/list-jobs', protectCompany, getCompanyPostedJobs);

// Change application status
router.put('/update-status', protectCompany, updateJobApplicationStatus);

// Change applications visibility
router.post('/change-visibility', protectCompany, ChangeVisibility);

export default router;
