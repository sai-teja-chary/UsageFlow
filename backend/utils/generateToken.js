import dotenv from 'dotenv'
import jwt from 'jsonwebtoken';
dotenv.config();

export const generateAccessToken = (user) =>{
    return jwt.sign(
        {id: user._id},
        process.env.JWT_SECRET,
        { expiresIn : '15m'}
    );
};

export const generateRefreshToken = (user) =>{
    return jwt.sign(
        {id : user._id},
        process.env.REFRESH_SECRET,
        {expiresIn:'7d'},
    );
};