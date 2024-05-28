import mongoose from 'mongoose';

// 도서 스키마 정의
const bookSchema = new mongoose.Schema({
    ISBN: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    author: { type: String, required: true },
    publisher: { type: String, required: true },
    updatedAt: { type: Date, default: Date.now },
    available: { type: Boolean, default: true }
});

// 인스턴스 메서드로 대여 가능 여부 토글
bookSchema.methods.toggleAvailability = function() {
    this.available = !this.available;
    return this.save();
};

// 저자에 따라 도서를 찾는 정적 메서드
bookSchema.statics.findByAuthor = function(author) {
    return this.find({ author });
};

const Book = mongoose.model('Book', bookSchema); // Book 모델 생성
export default Book; // Book 모델 내보내기
