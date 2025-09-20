import bcrypt from 'bcrypt';
import { v2 as cloudinary } from 'cloudinary';
import Company from "../models/Company.js";
import generateToken from "../utills/generateToken.js";
import Job from "../models/job.js";
import JobApplication from '../models/jobApplication.js';


// Register a new company
export const registerCompany = async (req, res) => {
    //console.log('Register Request body:', req.body);
    //console.log('Register Request file:', req.file);
    
    const { name, email, password } = req.body;
    const imageFile = req.file;

    if (!name || !email || !password || !imageFile) {
        return res.status(400).json({ 
            success: false, 
            message: "Missing Details",
            received: { name: !!name, email: !!email, password: !!password, imageFile: !!imageFile }
        });
    }

    try {
        const companyExists = await Company.findOne({ email });

        if (companyExists) {
            return res.status(400).json({ success: false, message: "Company already registered" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
            folder: "company_profiles",
            resource_type: "auto"
        });

        if (!imageUpload || !imageUpload.secure_url) {
            return res.status(500).json({ success: false, message: "Image upload failed" });
        }

        const company = await Company.create({
            name,
            email,
            password: hashPassword,
            image: imageUpload.secure_url
        });

        res.status(201).json({
            success: true,
            company: {
                _id: company._id,
                name: company.name,
                email: company.email,
                image: company.image
            },
            token: generateToken(company._id)
        });
    } catch (error) {
        console.error("Registration Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Company login
export const loginCompany = async (req, res) => {
    // Debug logging
    console.log('Login Request body:', req.body);
    console.log('Login Request headers:', req.headers);
    console.log('Content-Type:', req.get('Content-Type'));
    
    // Check if req.body exists
    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ 
            success: false, 
            message: 'Request body is empty or not parsed correctly',
            debug: {
                body: req.body,
                contentType: req.get('Content-Type')
            }
        });
    }

    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
        return res.status(400).json({ 
            success: false, 
            message: 'Email and password are required',
            received: { email: !!email, password: !!password }
        });
    }

    try {
        const company = await Company.findOne({ email });

        if (!company) {
            return res.status(404).json({ success: false, message: 'Company not found' });
        }

        const isMatch = await bcrypt.compare(password, company.password);

        if (isMatch) {
            res.json({
                success: true,
                company: {
                    _id: company._id,
                    name: company.name,
                    email: company.email,
                    image: company.image
                },
                token: generateToken(company._id)
            });
        } else {
            res.status(401).json({ success: false, message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get company data
export const getCompanyData = async (req, res) => {
    try {
        res.json({ success: true, company: req.company });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Post a new job
export const postJob = async (req, res) => {
    console.log('Post Job Request body:', req.body);
    
    const { title, description, location, salary, level, category } = req.body;
    const companyId = req.company._id;

    // Validate required fields
    if (!title || !description || !location || !salary || !level || !category) {
        return res.status(400).json({ 
            success: false, 
            message: "Missing required job details",
            received: { 
                title: !!title, 
                description: !!description, 
                location: !!location, 
                salary: !!salary, 
                level: !!level, 
                category: !!category 
            }
        });
    }

    try {
        const newJob = new Job({
            title,
            description,
            location,
            salary,
            companyId,
            date: Date.now(),
            level,
            category,
            visible: true
        });

        await newJob.save();
        res.status(201).json({ success: true, newJob });
    } catch (error) {
        console.error("Job Post Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get company job applicants (To be implemented)
export const getCompanyJobApplicants = async (req, res) => {
    try {
        const companyId = req.company._id
        // Find job application for the user and populate related data
        const applications = await JobApplication.find({ companyId })
        .populate('userId' , 'name email image resume')
        .populate('companyId', 'name email image')
        .populate('jobId' , 'title  location category salary level ')
        .exec()

        return res.json({success:true , applications})
    } catch (error) {

        res.json({ success: false, message: error.message });
    }
};

// Get company posted jobs
export const getCompanyPostedJobs = async (req, res) => {
    try {
        const companyId = req.company._id;
        const jobs = await Job.find({ companyId });

   //Adding No.fo applicants info in data
    const jobsData = await Promise.all(jobs.map(async (job) => {
    const applicants = await JobApplication.find({ jobId: job._id });
    return { ...job.toObject(), applicants: applicants.length };
    }));
   

        res.json({ success: true, jobsData});
    } catch (error) {
        console.error("Get Jobs Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Change job application status (To be implemented)
   
export const updateJobApplicationStatus = async (req, res) => {
  try {
    const { id, status } = req.body;

    if (!id || !status) {
      return res.status(400).json({ success: false, message: "Missing ID or status" });
    }

    const application = await JobApplication.findById(id);
    if (!application) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }

    // Fix comparison with lowercase
    if (
      application.status?.toLowerCase() === 'accepted' ||
      application.status?.toLowerCase() === 'rejected'
    ) {
      return res.status(400).json({ success: false, message: "Status already finalized" });
    }

    // Save new status
    application.status = status;
    await application.save();

    return res.status(200).json({ success: true, message: "Status updated successfully" });

  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


// Change job visibility
export const ChangeVisibility = async (req, res) => {
    try {
        console.log('Change Visibility Request body:', req.body);
        
        const { id } = req.body;
        const companyId = req.company._id;

        if (!id) {
            return res.status(400).json({ 
                success: false, 
                message: "Job ID is required" 
            });
        }

        const job = await Job.findById(id);

        if (!job) {
            return res.status(404).json({ 
                success: false, 
                message: "Job not found" 
            });
        }

        if (companyId.toString() === job.companyId.toString()) {
            job.visible = !job.visible;
            await job.save();
            res.json({ success: true, job });
        } else {
            res.status(403).json({ success: false, message: "Unauthorized to change visibility" });
        }
    } catch (error) {
        console.error("Visibility Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Test endpoint for debugging
export const testEndpoint = async (req, res) => {
    console.log('Test endpoint - Request body:', req.body);
    console.log('Test endpoint - Headers:', req.headers);
    
    res.json({ 
        success: true,
        message: "Test endpoint working",
        received: req.body,
        contentType: req.get('Content-Type')
    });
};