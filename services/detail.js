import { connectToDatabase } from '../models/detail.js';

async function getBookDetail(searchKey) {
    try {
        const collection = await connectToDatabase();
        let query;
        if (searchKey.charAt(0) === '9') {
            query = { book_isbn: searchKey };
        } else {
            query = { book_name: searchKey };
        }
        return await collection.findOne(query);
    } catch (error) {
        console.error('Error occurred in getBookDetail service:', error);
        throw error;
    }
}

export { getBookDetail };
