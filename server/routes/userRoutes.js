import express from 'express';
import multer from 'multer';
import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';
import { 
  syncUser, 
  getUserData, 
  applyForJob, 
  getUserJobApplications, 
  updateUserResume
} from '../controllers/userController.js';

const router = express.Router();

// Configure multer for memory storage (for Cloudinary)
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed!'), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Clerk authentication middleware
const requireAuth = ClerkExpressRequireAuth();

// Debug middleware
{/*router.use((req, res, next) => {
  console.log(`User Route: ${req.method} ${req.originalUrl}`);
  console.log('Headers:', { authorization: !!req.headers.authorization });
  next();
});*/}

// Routes - make sure all paths are explicit and valid
router.post('/sync', syncUser);
router.get('/data', requireAuth, getUserData);
router.get('/applications', requireAuth, getUserJobApplications);
router.post('/apply-job', requireAuth, applyForJob);
router.post('/update-resume', requireAuth, upload.single('resume'), updateUserResume);

// Remove any saved job routes from here as they should be in savedJobRoutes.js

export default router;