const fs = require('fs');
const path = require('path');

console.log('[v0] Starting batch hotel name replacement...');

const htmlFiles = [
  'beijing.html', 'convenience-services.html', 'convention-wedding.html', 'convention.html',
  'dining.html', 'directions.html', 'enford-hotel.html', 'faq.html', 'fitness.html',
  'floor-guide.html', 'lagoon-lounge.html', 'lagoon-pool.html', 'legal-notice.html',
  'lounge-licht21.html', 'mamachae.html', 'membership.html', 'mypage.html', 'notice.html',
  'online-consultation.html', 'privacy.html', 'register.html', 'room-deluxe-residence.html',
  'room-deluxe.html', 'room-premier-boutique.html', 'sauna.html', 'sizzling-house.html',
  'soleado.html', 'special-offer.html', 'terms.html', 'untact.html',
  'urban-oasis-membership.html', 'urban-oasis.html', 'via-latte.html', 'wedding.html'
];

const replacements = [
  { from: /엔포드호텔/g, to: '신라스테이' },
  { from: /ENFORD Hotel Cheongju/g, to: 'Shilla Stay Hotel' },
  { from: /ENFORD HOTEL/g, to: 'SHILLA STAY HOTEL' },
  { from: /ENFORD Hotel/g, to: 'Shilla Stay Hotel' },
  { from: /Enford Hotel/g, to: 'Shilla Stay Hotel' },
  { from: /enford_hotel/g, to: 'shillastay' },
  { from: /enford_user/g, to: 'shillastay_user' },
  { from: /#ENFORD HOTEL/g, to: '#SHILLA STAY' },
  { from: /Cheongju's/g, to: "Seoul's" },
  { from: /Cheongju-si/g, to: 'Seoul' },
  { from: /114, Chungcheongdae-ro, Cheongwon-gu, Cheongju-si, Chungcheongbuk-do/g, to: '249, Dongho-ro, Jung-gu, Seoul' },
  { from: /Tel: \+82-43-290-1000/g, to: 'Tel: +82-2-2230-0700' },
  { from: /Fax: \+82-43-290-1010/g, to: 'Fax: +82-2-2230-0800' },
  { from: /301-81-72352/g, to: '123-45-67890' },
  { from: /COPYRIGHT ENFORD HOTEL/g, to: 'COPYRIGHT SHILLA STAY HOTEL' }
];

let updatedCount = 0;

htmlFiles.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    replacements.forEach(({ from, to }) => {
      if (from.test(content)) {
        content = content.replace(from, to);
        modified = true;
      }
    });
    
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`[v0] ✓ Updated: ${file}`);
      updatedCount++;
    }
  }
});

console.log(`[v0] Batch update complete! Updated ${updatedCount} files.`);
