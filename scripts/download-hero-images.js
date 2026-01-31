/**
 * 히어로 슬라이드용 이미지를 public/images/에 다운로드합니다.
 * 빌드 전 실행 시 외부 의존 없이 로컬에서 이미지가 표시됩니다.
 * 사용: node scripts/download-hero-images.js
 */
const https = require('https');
const fs = require('fs');
const path = require('path');

const IMAGES_DIR = path.join(__dirname, '..', 'public', 'images');
const HERO_IMAGES = [
  { url: 'https://images.unsplash.com/photo-1591088398332-8a7791972843?w=1920', file: 'suite-room.jpg' },
  { url: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1920', file: 'premier-boutique.jpg' },
  { url: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=1920', file: 'hotel-exterior.jpg' },
  { url: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1920', file: 'deluxe-room.jpg' },
];

function download(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'ShillaStay-Build/1.0' } }, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`${url} => ${res.statusCode}`));
        return;
      }
      const chunks = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => resolve(Buffer.concat(chunks)));
      res.on('error', reject);
    }).on('error', reject);
  });
}

async function main() {
  if (!fs.existsSync(IMAGES_DIR)) {
    fs.mkdirSync(IMAGES_DIR, { recursive: true });
  }

  for (const { url, file } of HERO_IMAGES) {
    const filePath = path.join(IMAGES_DIR, file);
    try {
      const buf = await download(url);
      if (buf.length > 1000) {
        fs.writeFileSync(filePath, buf);
        console.log('[OK]', file);
      } else {
        console.warn('[SKIP]', file, '(too small, likely error page)');
      }
    } catch (e) {
      console.warn('[FAIL]', file, e.message);
    }
  }
}

main();
