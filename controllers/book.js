import puppeteer from 'puppeteer';
import os from 'os';
import { scrapeSites } from '../services/scrape.js';
import { fetchBooksFromAPI } from '../services/book.js';
import { findBook } from '../models/detail.js';
import * as authRepository from '../models/auth.js';
import * as bookRepository from '../models/detail.js';

// 도서 검색 함수
export async function searchBook(req, res) {
  const book_name = req.params.book_name;

  try {
    const results = await scrapeSites(book_name);
    res.json(results);
  } catch (error) {
    console.error('Error occurred:', error);
    res.status(500).send('Internal Server Error');
  }
}

// 최신 도서 목록 스크래핑 함수
export async function scrapeData(req, res) {
  const page_number = parseInt(req.query.page) || 1;
  const page_size = parseInt(req.query.pageSize) || 10;

  let executablePath;
  if (os.platform() === 'win32') {
    executablePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  } else if (os.platform() === 'darwin') {
    executablePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
  }

  try {
    const browser = await puppeteer.launch({
      executablePath,
      headless: true
    });
    const page = await browser.newPage();
    console.log('Navigating to page...');
    await page.goto('https://lib.seoul.go.kr/newarrival?newdays=30&category=all', { waitUntil: 'networkidle2' });
    console.log('Page loaded');
    await page.waitForSelector('tbody');
    console.log('Selector found');

    const rows = await page.$$('tbody tr');
    console.log(`Found ${rows.length} rows`);
    const data = [];

    for (let i = 0; i < 30 && i < rows.length; i++) {
      const row = rows[i];
      const num = await row.$eval('.footable-first-column', cell => cell.textContent.trim());
      const title = await row.$eval('.title.expand', cell => cell.textContent.trim());
      const author = await row.$eval('.author', cell => cell.textContent.trim());
      const hrefElement = await row.$('.title.expand a');
      const href = await page.evaluate(element => 'https://lib.seoul.go.kr/' + element.getAttribute('href'), hrefElement);

      data.push({
        num,
        title,
        author,
        href
      });
    }

    await browser.close();

    const pageIndex = (page_number - 1) * page_size;
    const pagedData = data.slice(pageIndex, pageIndex + page_size);

    res.json({
      page: page_number,
      pageSize: page_size,
      totalItems: data.length,
      totalPages: Math.ceil(data.length / page_size),
      data: pagedData
    });
  } catch (error) {
    console.error('Error during scraping:', error);
    res.status(500).json({ error: 'An error occurred during scraping.', details: error.message });
  }
}

// API에서 도서 정보를 가져와 HTML로 응답하는 함수
export async function getBooks(req, res) {
  try {
    const pageNumber = req.query.page || 1; // 요청된 페이지 번호를 받아옵니다.
    const pageSize = 10; // 페이지당 보여줄 도서 수
    const startIdx = (pageNumber - 1) * pageSize; // 페이지의 시작 인덱스
    const endIdx = startIdx + pageSize; // 페이지의 끝 인덱스

    // API에서 도서 정보를 가져옵니다.
    const bookItems = await fetchBooksFromAPI();

    // 요청된 페이지에 해당하는 도서만을 선택합니다.
    const pagedBookItems = bookItems.slice(startIdx, endIdx);

    // HTML 테이블을 구성합니다.
    let bookTable = '<div class="table-group" id="table-group"><div class="group-header"><h2>지금 인기있는 책</h2></div><table><tr><th>순위</th><th>도서명</th><th>작가</th><th>출판사</th></tr>';
    pagedBookItems.forEach((item, index) => {
      const authorRaw = String(item.AUTHOR);
      const author = authorRaw.replace(' 지음', '').trim();
      bookTable += `<tr>
                      <td id="item-index">${startIdx + index + 1}</td>
                      <td id="item-title">${item.TITLE}</td>
                      <td class="item-author-publisher">${author}</td>
                      <td class="item-author-publisher">${item.PUBLISHER}</td>
                    </tr>`;
    });
    bookTable += '</table></div>';

    // HTML 응답을 보냅니다.
    res.send(bookTable);
  } catch (error) {
    res.status(500).send(error.message);
  }
}
  
export async function extractBookInfo(req, res) {
  console.log('호출됨:', req.params.isbn)
  const data = await findBook(req.params.isbn);
  
  if (!data) {
    res.status(404).send('Book not found');
    return;
  }
  return res.json(data);

}

// export async function getBooks(req, res) {
//   try {
//     const pageNumber = req.query.page || 1; // 요청된 페이지 번호를 받아옵니다.
//     const pageSize = 10; // 페이지당 보여줄 도서 수
//     const startIdx = (pageNumber - 1) * pageSize; // 페이지의 시작 인덱스
//     const endIdx = startIdx + pageSize; // 페이지의 끝 인덱스

//     // API에서 도서 정보를 가져옵니다.
//     const bookItems = await fetchBooksFromAPI();

//     // 요청된 페이지에 해당하는 도서만을 선택합니다.
//     const pagedBookItems = bookItems.slice(startIdx, endIdx);

//     // HTML 테이블을 구성합니다.
//     let bookTable = '<div class="table-group" id="table-group"><div class="group-header"><h2>지금 인기있는 책</h2></div><table><tr><th>순위</th><th>도서명</th><th>작가</th><th>출판사</th></tr>';
//     pagedBookItems.forEach((item, index) => {
//       const authorRaw = String(item.AUTHOR);
//       const author = authorRaw.replace(' 지음', '').trim();
//       bookTable += `<tr>
//                       <td id="item-index">${startIdx + index + 1}</td>
//                       <td id="item-title">${item.TITLE}</td>
//                       <td class="item-author-publisher">${author}</td>
//                       <td class="item-author-publisher">${item.PUBLISHER}</td>
//                     </tr>`;
//     });
//     bookTable += '</table></div>';

//     // HTML 응답을 보냅니다.
//     res.send(bookTable);
//   } catch (error) {
//     res.status(500).send(error.message);
//   }

