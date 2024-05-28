import express from 'express';
import * as authController from '../controllers/auth.js';
import * as bookController from '../controllers/book.js';
import { validateLogin, validateSignup, validateId } from "../middleware/validator.js";
import { isAuth } from "../middleware/auth.js";


const router = express.Router();

router.post('/register', validateSignup, authController.register);
router.post('/login', validateLogin, authController.login);
router.post('/checkToken', authController.checkToken); //토큰 유효성 검사
router.post('/checkid', validateId, authController.checkId); //아이디 중복확인
router.get('/logout', isAuth, authController.logout);
router.get('/me', isAuth, authController.me); //로그인한 사용자 정보
router.post('/getuserinfo', isAuth, authController.getUserInfo); //사용자 정보조회
router.post('/findid', authController.findID);
router.post('/findpw', authController.resetPassword);
router.post('/update', isAuth, authController.updateUserInfo); //사용자 정보수정
router.delete('/quit', isAuth, authController.deleteUser);

router.get('/getmybooks', isAuth, authController.getMyBooksInfo);  // 특정유저의 최근 본 책 정보 조회

//관리자로그인 추가예정



export default router;