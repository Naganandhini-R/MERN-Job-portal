import mongoose from 'mongoose';
import dotenv from 'dotenv';
import JobApplication from '../models/jobApplication.js';

dotenv.config();
await mongoose.connect(process.env.MONGODB_URI);

const deleteInvalidJobApplications = async () => {
  const deleted = await JobApplication.deleteMany({ userId: { $type: 'string' } });
  console.log(`🧹 Deleted ${deleted.deletedCount} invalid applications.`);
  process.exit();
};

deleteInvalidJobApplications();
