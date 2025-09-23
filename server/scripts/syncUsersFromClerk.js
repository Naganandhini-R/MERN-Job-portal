import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import { clerkClient } from '@clerk/clerk-sdk-node';

dotenv.config();
await mongoose.connect(process.env.MONGODB_URI);
console.log('MongoDB connected');

const syncUserDataFromClerk = async () => {
  const clerkUsers = await clerkClient.users.getUserList();

  for (const clerkUser of clerkUsers) {
    try {
      const existing = await User.findOne({ clerkId: clerkUser.id });

      const name = `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || clerkUser.username;
      const email = clerkUser.emailAddresses?.[0]?.emailAddress;
      const image = clerkUser.imageUrl;

      if (existing) {
        const duplicate = await User.findOne({ email, _id: { $ne: existing._id } });
        if (duplicate) {
          console.log(`⚠️ Duplicate email skipped: ${email}`);
          continue;
        }

        existing.name = name;
        existing.email = email;
        existing.image = image;
        await existing.save();
        console.log(`📝 Synced user: ${existing.email}`);
      } else {
        console.log(`❌ No user found for clerkId ${clerkUser.id}`);
      }
    } catch (err) {
      console.error(`🔥 Error syncing user ${clerkUser.id}:`, err.message);
    }
  }

  console.log("✅ Clerk sync complete");
  process.exit();
};

syncUserDataFromClerk();
