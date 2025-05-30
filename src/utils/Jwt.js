import jwt from 'jsonwebtoken';
import 'dotenv/config';

export const generateAuthToken = (payload) => {
    return jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
    );
};