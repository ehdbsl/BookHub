import axios from 'axios';
import { parseString } from 'xml2js';
import * as bookRepository from '../models/detail.js';
import * as bookController from '../controllers/book.js';
import { config } from '../config.js';

// API endpoint URL 변경 (도서 Top 100)
const apiUrl = "http://openapi.seoul.go.kr:8088/754b75666e656665343642414b6756/xml/SeoulLibraryBookRentNumInfo/1/50/";

// xml2js의 parseString 함수를 프로미스로 변환하는 함수
const parseXML = (xmlData) => {
    return new Promise((resolve, reject) => {
        parseString(xmlData, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}

// API에서 데이터를 가져와서 XML을 JSON으로 파싱하는 함수
export async function fetchBooksFromAPI() {
    try {
        const response = await axios.get(apiUrl);
        const xmlData = response.data;

        // XML을 JSON으로 파싱합니다.
        const jsonData = await parseXML(xmlData);
        
        // 도서 정보를 추출합니다.
        const bookItems = jsonData.SeoulLibraryBookRentNumInfo.row;

        return bookItems;
    } catch (error) {
        console.error('API에서 도서 정보를 가져오는 중 오류 발생:', error);
        throw error;
    }
}

export async function bookRegistration(req, res) {
    const { isbn } = req.body;
    if (!isbn) {
        return res.status(400).json({ message: 'ISBN을 입력해주세요.' });
    }
    const findIsbn = await bookRepository.findIsbn(isbn);
    if (findIsbn) {
        return res.status(400).json({ message: '이미 저장된 도서입니다.' });
    }
    const display = 10;
    const start = 1;
    const url = `https://openapi.naver.com/v1/search/book.json?query=${encodeURIComponent(isbn)}&display=${display}&start=${start}`;
    const headers = {
        'X-Naver-Client-Id': config.naver.clientId,
        'X-Naver-Client-Secret': config.naver.clientSecret
    };
    const response = await axios.get(url, { headers });
    const bookData = response.data.items;
    // res.json({ books });
    const result = bookRepository.saveBookData(bookData);
    res.status(200).json({ message: '도서가 성공적으로 저장되었습니다.' });
}