import express from 'express'; // Express 모듈 불러오기
import { getRecentlyViewedBooks,getUserViewedBooks } from '../controllers/userController.js'; // 컨트롤러 함수 불러오기


const router = express.Router(); // 라우터 생성
console.log('getRecentlyViewedBooks:', getRecentlyViewedBooks); // 함수가 정의되어 있는지 확인

router.get('/:userId/viewed-books', getUserViewedBooks); // 회원이 열람한 도서 조회 라우트 설정
// 사용자의 최근 본 도서 목록을 조회하는 라우트
router.get('/users/:userId/recentlyViewed', getRecentlyViewedBooks);

// router.get('/users/:userId/recentlyViewed', (req, res) => {
//     console.log('Route handler called');
//     getRecentlyViewedBooks(req, res);
// });

export default router; // 라우터 내보내기
