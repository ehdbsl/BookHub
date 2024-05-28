import { getBookDetail } from '../services/detail.js';

export async function getBookDetailController(req, res) {
    const searchKey = req.params.searchKey;
    try {
        const book = await getBookDetail(searchKey);
        if (!book) {
            res.status(404).send(`
                <div class="container">
                    <h1>에러 발생</h1>
                    <p>책을 찾을 수 없습니다.</p>
                </div>
            `);
            return;
        }
        res.send(`
            <div class="container">
                <h1>${book.book_name}</h1>
                <img src="${book.book_img}" alt="${book.book_name} 이미지">
                <p>저자: ${book.book_aut}</p>
                <p>출판사: ${book.book_company}</p>
                <p>ISBN: ${book.book_isbn}</p>
                <p>줄거리: ${book.book_des}</p>
            </div>
        `);
    } catch (error) {
        console.error('Error occurred in getBookDetailController:', error);
        res.status(500).send(`
            <div class="container">
                <h1>에러 발생</h1>
                <p>서버 오류가 발생했습니다.</p>
            </div>
        `);
    }
}
