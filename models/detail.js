import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.DB_HOST;
const client = new MongoClient(uri);

export async function connectToDatabase() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
        return client.db('BookHub').collection('book');
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error);
        throw error;
    }
}

export async function findBook(isbn) {
    const data = await client.db('BookHub').collection('book').findOne({ book_isbn: isbn });
    // 책 제목, 작가, 줄거리, 이미지만 추출
    if (!data) {
        return null;
    }
    return {
        title: data.book_name,
        author: data.book_aut,
        image: data.book_img,
        summary: data.book_des
    };
}

export async function findIsbn(isbn) {
    const data = await client.db('BookHub').collection('book').findOne({ book_isbn: isbn });
    return data;
}

export const checkDuplicateIsbn = async (isbn) => {
    const book = await client.db('BookHub').collection('book').findOne({ book_isbn: isbn });
    return book !== null;
};

export const saveBookData = async (bookData) => {
    // const { title, image = '', author = '', publisher = '', isbn = '', description = '' } = bookData;
    const { title, image, author, publisher, isbn, description } = await bookData[0];
    // console.log(bookData); 테스트완료
    
    if (!await checkDuplicateIsbn(isbn)) {
        const bookData = {
            book_name: title,
            book_img: image,
            book_aut: author,
            book_company: publisher,
            book_isbn: isbn,
            book_des: description
        };
        await client.db('BookHub').collection('book').insertOne(bookData);
        console.log('bookDatas:', bookData);
        console.log("MongoDB에 책 정보 저장 완료:", title);
    } else {
        console.log("이미 데이터베이스에 존재하는 책입니다. 건너뜁니다:", title);
    }
};

// export async function storeBook(bookData) {
//     const bookData = {
//         book_name: req.body.title,
//         book_img: req.body.image,
//         book_aut: req.body.author,
//         book_company: req.body.publisher,
//         book_isbn: req.body.isbn,
//         book_des: req.body.summary
//     };
//     await client.db('BookHub').collection('book').insertOne(bookData);
//     res.json({ message: '도서가 성공적으로 저장되었습니다.' });
// }

