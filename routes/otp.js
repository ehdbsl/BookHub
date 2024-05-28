import express from 'express';
import * as otpController from '../controllers/otp.js';

const router = express.Router();

router.get('/signOTP', otpController.renderSignup);
router.post('/sendOTP', otpController.sendOTP);
router.post('/verifyOTP', otpController.verifyOTP);

export default router;


