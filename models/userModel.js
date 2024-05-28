import mongoose from 'mongoose'; // Mongoose 모듈 불러오기

const userSchema = new mongoose.Schema({ // 회원 스키마 정의
    userId: { type: String, required: true, unique: true }, // 회원 ID 필드 설정
    nickname: { type: String, required: true }, // 닉네임 필드 설정
    viewedBooks: [{ // 열람한 도서 목록 필드 설정
        ISBN: String, // ISBN 필드 설정
        title: String, // 도서명 필드 설정
        author: String, // 저자 필드 설정
        publisher: String, // 출판사 필드 설정
        viewedAt: { type: Date, default: Date.now } // 열람 날짜 필드 설정
    }]
});

const Users = mongoose.models.User || mongoose.model('User', userSchema);
// mongoose.model('User', userSchema); // User 모델 생성

export default Users; // User 모델 내보내기
