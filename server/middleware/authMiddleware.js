import jwt from 'jsonwebtoken';
import Company from '../models/Company.js';

export const protectCompany = async (req, res, next) => {
    try {
         const token = req.headers.authorization || req.headers.token;

        if (!token) {
            return res.status(401).json({ 
                success: false, 
                message: 'Access denied. No token provided.' 
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded.id) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid token format' 
            });
        }

        const company = await Company.findById(decoded.id).select('-password');

        if (!company) {
            return res.status(404).json({ 
                success: false, 
                message: 'Company not found' 
            });
        }

        req.company = company;
        next();

    } catch (error) {
        console.error('protectCompany middleware error:', error);
        
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid token' 
            });
        }
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                success: false, 
                message: 'Token expired' 
            });
        }

        return res.status(500).json({ 
            success: false, 
            message: 'Server error in authentication' 
        });
    }
};
