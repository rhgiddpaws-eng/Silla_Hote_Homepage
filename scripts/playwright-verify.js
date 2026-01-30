/**
 * Playwright로 Next 빌드/개발 서버 대상 주요 페이지 스크린샷 및 이미지 검증
 * 사용: BASE_URL=http://localhost:3000 node scripts/playwright-verify.js
 * (먼저 npm run dev 또는 npm run build && npm run start 실행)
 */
const path = require('path');
const fs = require('fs');

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const PAGES = [
  { path: '/', name: 'index' },
  { path: '/rooms', name: 'rooms' },
  { path: '/room-suite', name: 'room-suite' },
  { path: '/dining', name: 'dining' },
  { path: '/login', name: 'login' },
  { path: '/mypage', name: 'mypage' },
  { path: '/special-offer', name: 'special-offer' },
  { path: '/room-deluxe', name: 'room-deluxe' },
  { path: '/wedding', name: 'wedding' },
];

const SCREENSHOTS_DIR = path.join(__dirname, '..', 'screenshots');
const RESULTS_PATH = path.join(__dirname, '..', 'check-results.json');

async function main() {
  let playwright;
  try {
    playwright = require('playwright');
  } catch (e) {
    console.error('Playwright가 없습니다. npm install 후 실행하세요.');
    process.exit(1);
  }
  const { chromium } = playwright;
  if (!fs.existsSync(SCREENSHOTS_DIR)) {
    fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
  }

  const results = [];
  let browser;
  try {
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

    for (const { path: pagePath, name } of PAGES) {
      const url = BASE_URL + pagePath;
      try {
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 });
        await page.waitForTimeout(2000);

        const screenshotPath = path.join(SCREENSHOTS_DIR, `${name}.png`);
        await page.screenshot({ path: screenshotPath, fullPage: true });

        const imgInfo = await page.$$eval('img', (nodes) =>
          nodes.map((n, i) => ({
            index: i,
            src: (n.src || '').substring(0, 120),
            alt: n.alt,
            complete: n.complete,
            naturalWidth: n.naturalWidth,
            naturalHeight: n.naturalHeight,
          }))
        );
        const bgImages = await page.$$eval(
          '[style*="background-image"]',
          (nodes) =>
            nodes.map((n, i) => ({
              index: i,
              style: (n.getAttribute('style') || '').substring(0, 100),
            }))
        );

        const brokenImgs = imgInfo.filter((i) => !i.complete || i.naturalWidth === 0);
        const ok = brokenImgs.length === 0;
        results.push({
          path: pagePath,
          name,
          url,
          ok,
          imagesTotal: imgInfo.length,
          imagesBroken: brokenImgs.length,
          details: imgInfo,
          bgCount: bgImages.length,
        });
        console.log(
          ok ? `[OK] ${name}` : `[FAIL] ${name} (broken images: ${brokenImgs.length})`
        );
      } catch (err) {
        console.error(`[ERROR] ${name}:`, err.message);
        results.push({
          path: pagePath,
          name,
          url,
          ok: false,
          error: err.message,
        });
      }
    }

    fs.writeFileSync(RESULTS_PATH, JSON.stringify(results, null, 2), 'utf8');
    console.log('\n스크린샷:', SCREENSHOTS_DIR);
    console.log('결과:', RESULTS_PATH);
    const failed = results.filter((r) => !r.ok);
    if (failed.length > 0) {
      console.log('실패한 페이지:', failed.map((r) => r.name).join(', '));
      process.exitCode = 1;
    }
  } catch (e) {
    console.error(e);
    process.exit(1);
  } finally {
    if (browser) await browser.close();
  }
}

main();
