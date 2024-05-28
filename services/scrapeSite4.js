
export async function scrapeSite4(browser, book_name) {
  const page = await browser.newPage();
  const url = `https://www.ydplib.or.kr/intro/menu/10003/program/30001/plusSearchResultList.do?searchType=SIMPLE&searchMenuCollectionCategory=&searchCategory=ALL&searchKey1=&searchKey2=&searchKey3=&searchKey4=&searchKey5=&searchKeyword1=&searchKeyword2=&searchKeyword3=&searchKeyword4=&searchKeyword5=&searchOperator1=&searchOperator2=&searchOperator3=&searchOperator4=&searchOperator5=&searchPublishStartYear=&searchPublishEndYear=&searchRoom=&searchKdc=&searchIsbn=&currentPageNo=1&viewStatus=IMAGE&preSearchKey=ALL&preSearchKeyword=${book_name}&searchKey=ALL&searchKeyword=${book_name}&searchLibrary=ALL&searchLibraryArr=CA&searchLibraryArr=CB&searchLibraryArr=CC&searchLibraryArr=MA&searchLibraryArr=LX&searchLibraryArr=LW&searchLibraryArr=CF&searchLibraryArr=LF&searchLibraryArr=LG&searchLibraryArr=LR&searchLibraryArr=LS&searchLibraryArr=LT&searchLibraryArr=LH&searchLibraryArr=LU&searchLibraryArr=LL&searchLibraryArr=LC&searchLibraryArr=LM&searchLibraryArr=LN&searchLibraryArr=LO&searchLibraryArr=LP&searchLibraryArr=LQ&searchLibraryArr=LJ&searchLibraryArr=LK&searchLibraryArr=LE&searchLibraryArr=LA&searchLibraryArr=LD&searchLibraryArr=LB&searchLibraryArr=LV&searchLibraryArr=CD&searchSort=SIMILAR&searchOrder=DESC&searchRecordCount=10`;

  await page.goto(url);

  const isResultsExist = await page.evaluate(() => {
      const lis = document.querySelectorAll('.resultList.imageType li');
      return lis.length > 0;
  });

  if (!isResultsExist) {
      console.log('site 3 : 검색 결과가 없습니다.');
      await page.close();
      return [];
  }

  await page.waitForSelector('.resultList.imageType li');

  const results = await page.evaluate(() => {
      const lis = document.querySelectorAll('.resultList.imageType li');
      const formattedResults = [];
      lis.forEach(li => {
        const imgElement = (li.querySelector('.img img')?.getAttribute('src') || '').trim();
        const titleElement = (li.querySelector('.tit a')?.textContent || '').trim();
        const authorElement = (li.querySelector('.author span:nth-child(1)')?.textContent || '').trim();
        const data1Element = (li.querySelector('.data span:nth-child(1)')?.textContent || '').trim();
        const siteElement = (li.querySelector('.site span')?.textContent || '').trim();
        const txtElement = (li.querySelector('.txt ')?.textContent || '').trim();
        if (!titleElement) {
          console.log('Site 3: 제목이 없는 자료가 있습니다.');
          return;
        }
        formattedResults.push({ imgElement, titleElement, authorElement, data1Element, siteElement, txtElement });
      });
      return formattedResults;
  });
  
  const firstThreeResults = results.slice(0, 3);
  console.log('site 3 :', firstThreeResults);

  await page.close();
  return firstThreeResults;
}