import express from 'express'; // Express 모듈 불러오기
import * as bookControllers from '../controllers/bookController.js'; // 도서 컨트롤러 함수 불러오기
// import * as userControllers from '../controllers/userController.js'; // 회원 컨트롤러 함수 불러오기

const router = express.Router(); // 라우터 생성

// 도서 라우트 설정
// 모든 도서를 조회하는 라우트
router.get('/books', bookControllers.getAllBooks);
// 특정 저자의 도서를 조회하는 라우트
// router.get('/books/author/:author', bookControllers.getBooksByAuthor);
router.get('/books/search', bookControllers.searchBooks); // 검색 라우터 추가
// 도서의 대여 가능 여부를 토글하는 라우트
router.put('/books/:id/toggleAvailability', bookControllers.toggleBookAvailability);
router.put('/books/:id', bookControllers.updateBook); // 도서 업데이트 라우트 설정
router.delete('/books/:id', bookControllers.deleteBook); // 도서 삭제 라우트 설정
router.get('/search-history', bookControllers.getAllSearchHistory); // 검색 기록 조회 라우터 추가

// // 회원 라우트 설정
// router.get('/:userId/viewed-books', userControllers.getUserViewedBooks); // 회원이 열람한 도서 조회 라우트 설정
export default router; // 라우터 내보내기








