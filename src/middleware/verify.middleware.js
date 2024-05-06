
import jwt from 'jsonwebtoken';
import { userIdentityService } from '../service';
import env from 'dotenv';
env.config(); 


export default function verify(req , res, next) {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).json({ message: 'Token is required.' });
    }
    try {
        const decoded = userIdentityService.verify(token);
        console.log('aaa' + decoded);
        userIdentityService.assignUserRequestContext(decoded,req);
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token.' });
    }
}