import * as Users from '../models/userModel.js'; // User 모델 불러오기
import * as User from '../models/user.js';
// 회원이 열람한 도서 조회
export async function getUserViewedBooks(req, res) {
    try {
        const { userId } = req.params; // 요청 파라미터에서 회원 ID 가져오기
        const user = await Users.findOne({ userId }); // 회원 조회
        res.json(user.viewedBooks); // 회원이 열람한 도서 목록 반환
    } catch (err) {
        res.status(500).json({ message: err.message }); // 오류 발생 시 오류 메시지 반환
    }
}
console.log(User.findRecentlyViewedBooks,'정의되어 있는지 확인');
// 사용자의 최근 본 도서 목록을 조회하는 함수
export const getRecentlyViewedBooks = async (req, res) => {
    try {
        const { userId } = req.params; // 사용자 ID를 경로 매개변수로부터 추출
        console.log(`Fetching recently viewed books for user ID: ${userId}`);
        const books = await User.findRecentlyViewedBooks(userId); // 사용자의 최근 본 도서 목록 조회
        console.log('Recently viewed books:', books);
        res.json(books); // 조회된 도서 목록 반환
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message }); // 오류 발생 시 오류 메시지 반환
    }
};