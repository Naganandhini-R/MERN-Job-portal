import './config/instrument.js';
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import connectCloudinary from './config/cloudinary.js';
import companyRoutes from './routes/companyRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { clerkMiddleware } from '@clerk/express';
import * as Sentry from '@sentry/node';
import 'dotenv/config';
import savedJobRoutes from "./routes/savedJobRoutes.js";

const app = express();

// Connect DB + Cloudinary
await connectDB();
await connectCloudinary();

// Middleware
app.use(cors());
app.use(express.json());
app.use(clerkMiddleware()); // ✅ sets req.auth

// Routes
app.get('/', (req, res) => res.send('✅ API working'));
app.use('/api/company', companyRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/users', userRoutes);
app.use("/api/users", savedJobRoutes); 

// Start server
const PORT = process.env.PORT || 5000;
Sentry.setupExpressErrorHandler(app);
app.listen(PORT, () => console.log(`🚀 Server running on ${PORT}`));