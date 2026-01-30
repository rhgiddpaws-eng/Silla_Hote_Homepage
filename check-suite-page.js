/**
 * Playwright로 room-suite.html을 Chrome에서 열고 이미지 표시 여부 확인
 * 실행: npm run check-suite (또는 npm install 후 node check-suite-page.js)
 */
const path = require('path');
const fs = require('fs');

async function main() {
  let playwright;
  try {
    playwright = require('playwright');
  } catch (e) {
    console.error('Playwright가 없습니다. 먼저 실행: npm install');
    process.exit(1);
  }
  const { chromium } = playwright;
  const filePath = path.resolve(__dirname, 'room-suite.html');
  const fileUrl = 'file:///' + filePath.replace(/\\/g, '/').replace(/ /g, '%20');

  let browser;
  try {
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
    await page.goto(fileUrl, { waitUntil: 'domcontentloaded', timeout: 10000 });
    await page.waitForTimeout(1500);

    const imgs = await page.$$eval('img.sub-hero-img, img.detail-main-img', nodes =>
      nodes.map((n, i) => ({
        index: i,
        alt: n.alt,
        complete: n.complete,
        naturalWidth: n.naturalWidth,
        naturalHeight: n.naturalHeight,
        display: getComputedStyle(n).display,
        width: getComputedStyle(n).width,
        height: getComputedStyle(n).height,
        isDataUri: (n.src || '').indexOf('data:') === 0
      }))
    );

    await page.screenshot({ path: path.join(__dirname, 'suite-page-screenshot.png'), fullPage: true });
    const result = {
      imagesFound: imgs.length,
      imagesVisible: imgs.filter(i => i.naturalWidth > 0).length,
      details: imgs
    };
    fs.writeFileSync(
      path.join(__dirname, 'check-result.txt'),
      '=== Suite 페이지 이미지 체크 ===\n' + JSON.stringify(result, null, 2) + '\n\n이미지가 보이면 naturalWidth > 0 이어야 함.',
      'utf8'
    );
    console.log('이미지 개수:', imgs.length);
    console.log('표시된 이미지(naturalWidth>0):', result.imagesVisible);
    console.log('상세:', result.details);
    console.log('스크린샷: suite-page-screenshot.png');
    await browser.close();
    return result;
  } catch (e) {
    console.error(e);
    if (browser) await browser.close();
    process.exit(1);
  }
}

main();
