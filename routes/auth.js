import express from 'express';
import * as authController from '../controllers/auth.js';
import { validateLogin, validateSignup } from "../middleware/validator.js";
import { isAuth } from "../middleware/auth.js";


const router = express.Router();

router.post('/register', validateSignup, authController.register);
router.post('/login', validateLogin, authController.login);
router.get('/logout', isAuth, authController.logout);
router.get('/me', isAuth, authController.me);
router.get('/getuserinfo', authController.getUserInfo);
router.post('/findid', authController.findUser);
router.post('/findpw', authController.resetPassword);
router.post('/update', isAuth, authController.updateUserInfo);



export default router;