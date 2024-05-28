import express from "express";
import * as bookController from "../controllers/book.js";
import * as authController from "../controllers/auth.js";
import { updateRecentBooks } from "../controllers/recent.js";
import { getRecentBooks } from '../controllers/recent_view.js';
import { getBookDetailController } from '../controllers/detail.js';
// import { scrapeSites } from "../services/scrape.js";
import { isAuth } from "../middleware/auth.js";
import { findBook } from "../models/detail.js";
import { bookRegistration } from "../services/book.js";


const router = express.Router();

router.get('/search/:book_name', bookController.searchBook);  // 도서 검색
router.get('/scrape', bookController.scrapeData);  // 신작
router.get('/books', bookController.getBooks);  // top50
router.post('/update', isAuth, updateRecentBooks);  // 최근 본 도서 업데이트
router.get('/view', isAuth, getRecentBooks);  // 최근 본 도서 목록(5개) 조회
router.get('/detail/:searchKey', getBookDetailController);  // 도서 상세 정보 조회
// router.get('/book/:isbn', bookController.extractBookInfo);  // 도서 목록 간략 조회

router.post('/store', bookRegistration);  // 도서 정보 저장


export default router;
