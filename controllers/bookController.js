import Book from '../models/bookModel.js';
import SearchHistory from '../models/searchHistory.js';

// 모든 도서를 조회하는 함수
export const getAllBooks = async (req, res) => {
    try {
        console.log("Fetching all books...");
        const books = await Book.find();
        console.log("Books found: ", books);
        res.json(books);
    } catch (err) {
        console.error("Error fetching books:", err);
        res.status(500).json({ message: err.message });
    }
};

// 다양한 필드를 기반으로 도서를 검색하는 함수
export const searchBooks = async (req, res) => {
  try {
      const { query } = req.query;
      console.log(`Searching books with query: ${query}`); // 검색어 로그

      const books = await Book.find({
          $or: [
              { _id: query },
              { title: new RegExp(query, 'i') },
              { author: new RegExp(query, 'i') },
              { publisher: new RegExp(query, 'i') }
          ]
      });

      console.log('Books found:', books); // 검색 결과 로그
      res.json(books);
  } catch (err) {
      console.error('Error fetching books:', err); // 오류 로그
      res.status(500).json({ message: err.message });
  }
};

// // 특정 저자의 도서를 조회하는 함수
// export const getBooksByAuthor = async (req, res) => {
//     try {
//         const { author } = req.params;
//         const books = await Book.findByAuthor(author);
//         const userId = req.user.id; // 사용자 인증 시스템에 따라 적절히 수정
//         await saveSearchHistory(userId, author);
//         res.json(books);
//     } catch (err) {
//         console.error(`Error fetching books by author ${author}:`, err);
//         res.status(500).json({ message: err.message });
//     }
// };

// 검색 기록을 저장하는 함수
const saveSearchHistory = async (userId, query) => {
    const newSearchHistory = new SearchHistory({ userId, query });
    await newSearchHistory.save();
};

// 모든 검색 기록을 조회하는 함수
export const getAllSearchHistory = async (req, res) => {
    try {
        const searchHistories = await SearchHistory.find().sort({ searchDate: -1 });
        res.json(searchHistories);
    } catch (err) {
        console.error("Error fetching search histories:", err);
        res.status(500).json({ message: err.message });
    }
};

// 도서의 대여 가능 여부를 토글하는 함수
export const toggleBookAvailability = async (req, res) => {
    try {
        const { id } = req.params; // 요청 파라미터에서 도서 ID 가져오기
        console.log(`Toggling availability for book ID: ${id}`); // 디버깅 로그 추가
        const book = await Book.findById(id); // 도서 ID로 도서 조회
        if (!book) throw new Error('Book not found'); // 도서가 없으면 오류 발생

        await book.toggleAvailability(); // 대여 가능 여부 토글
        console.log(`Book availability toggled: `, book); // 토글된 도서 로그
        res.json(book); // 토글된 도서 반환
    } catch (err) {
        console.error(`Error toggling availability for book ID ${id}: `, err); // 오류 로그
        res.status(500).json({ message: err.message }); // 오류 발생 시 오류 메시지 반환
    }
};

// 도서를 업데이트하는 함수
export const updateBook = async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = { ...req.body };
  
      // Optional: Remove ISBN from the update data if it is not intended to be updated
      // delete updateData.ISBN;
  
      console.log(`Updating book ID: ${id}`);
  
      const book = await Book.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
      if (!book) {
        throw new Error('Book not found');
      }
  
      console.log('Book updated: ', book);
      res.json(book);
    } catch (err) {
      if (err.code === 11000) {
        // Handle duplicate key error
        return res.status(400).json({ message: 'Duplicate key error: ISBN already exists' });
      }
      console.error(`Error updating book ID ${id}: `, err);
      res.status(500).json({ message: err.message });
    }
  };
  
  

// 도서를 삭제하는 함수
export const deleteBook = async (req, res) => {
    try {
      const { id } = req.params; // 요청 파라미터에서 도서 ID 가져오기
      console.log(`Deleting book ID: ${id}`); // 디버깅 로그 추가
      const book = await Book.findByIdAndDelete(id); // 도서 삭제
      if (!book) throw new Error('Book not found'); // 도서가 없으면 오류 발생
  
      console.log('Book deleted: ', book); // 삭제된 도서 로그
      res.json({ message: 'Book deleted successfully' }); // 삭제 성공 메시지 반환
    } catch (err) {
      console.error(`Error deleting book ID ${id}: `, err); // 오류 로그
      res.status(500).json({ message: err.message }); // 오류 발생 시 오류 메시지 반환
    }
  };

  