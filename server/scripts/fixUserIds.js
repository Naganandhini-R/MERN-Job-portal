import mongoose from 'mongoose';
import dotenv from 'dotenv';
import JobApplication from '../models/jobApplication.js';
import User from '../models/User.js';

dotenv.config();
await mongoose.connect(process.env.MONGODB_URI);
console.log(" MongoDB connected");

const fixUserRefs = async () => {
  const allApps = await JobApplication.find().populate('userId');

  for (const app of allApps) {
    const user = await User.findOne({ clerkId: app.userId?.clerkId || app.userId });

    if (!user) {
      console.log(`No valid user found for application ${app._id}`);
      continue;
    }

    if (String(app.userId._id) !== String(user._id)) {
      app.userId = user._id;
      await app.save();
      console.log(`Fixed user for application ${app._id}`);
    }
  }

  console.log("🚀 Done fixing JobApplication.userId references");
  process.exit();
};

fixUserRefs();
