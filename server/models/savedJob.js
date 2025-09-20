import mongoose from "mongoose";

const savedJobSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // Clerk user ID
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("SavedJob", savedJobSchema);
