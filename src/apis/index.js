import express from 'express';
import { UserRoute } from './users/index.js';


const router = express.Router();

router.use('/users', UserRoute);


export default router;