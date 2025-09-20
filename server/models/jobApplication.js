import mongoose from "mongoose";
import Company from "../models/Company.js";

const JobApplicationschema = new mongoose.Schema({
    userId: { type:mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // match Clerk ID string
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    status: { type: String, default: 'Pending' },
    date: { type:Date , required: true }
})

const JobApplication = mongoose.model('JobApplication', JobApplicationschema)

export default JobApplication