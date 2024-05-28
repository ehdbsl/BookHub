import puppeteer from 'puppeteer';
import { scrapeSite1 } from './scrapeSite1.js';
import { scrapeSite2 } from './scrapeSite2.js';
import { scrapeSite3 } from './scrapeSite3.js';
import { scrapeSite4 } from './scrapeSite4.js';
// 나머지 사이트 스크래핑 모듈도 이렇게 import!

export const scrapeSites = async (book_name) => {
    const browser = await puppeteer.launch({ headless: true });

    const [ 강남구통합도서관, 강동구립도서관, 마포구립도서관, 영등포구립도서관 ] = await Promise.all([
        scrapeSite1(browser, book_name),
        scrapeSite2(browser, book_name),
        scrapeSite3(browser, book_name),
        scrapeSite4(browser, book_name)
        // 나머지 사이트 스크래핑 함수도 이런 식으로 호출
        
    ]);
    await browser.close();

    return { 강남구통합도서관, 강동구립도서관, 마포구립도서관, 영등포구립도서관 };
}
