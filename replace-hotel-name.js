const fs = require('fs');
const path = require('path');

const replacements = [
  { from: /엔포드호텔/g, to: '신라스테이' },
  { from: /엔포드 호텔/g, to: '신라스테이' },
  { from: /ENFORD Hotel Cheongju/g, to: 'Shilla Stay Hotel' },
  { from: /ENFORD Hotel/g, to: 'Shilla Stay Hotel' },
  { from: /ENFORD HOTEL/g, to: 'SHILLA STAY HOTEL' },
  { from: /#ENFORD HOTEL/g, to: '#SHILLA STAY' },
  { from: /enford_hotel/g, to: 'shillastay' },
  { from: /enford_user/g, to: 'shillastay_user' },
  { from: /enford_popup/g, to: 'shillastay_popup' },
  { from: /@enford_hotel/g, to: '@shillastay' },
  { from: /Cheongju's/g, to: "Seoul's" },
  { from: /Cheongju/g, to: 'Seoul' },
  { from: /301-81-72352/g, to: '123-45-67890' },
  { from: /114, Chungcheongdae-ro, Cheongwon-gu, Cheongju-si, Chungcheongbuk-do/g, to: '249, Dongho-ro, Jung-gu, Seoul' },
  { from: /\+82-43-290-1000/g, to: '+82-2-2230-0700' },
  { from: /\+82-43-290-1010/g, to: '+82-2-2230-0800' },
];

const files = [
  'beijing.html',
  'convenience-services.html',
  'convention-wedding.html',
  'convention.html',
  'dining.html',
  'directions.html',
  'enford-hotel.html',
  'faq.html',
  'fitness.html',
  'floor-guide.html',
  'lagoon-lounge.html',
  'lagoon-pool.html',
  'legal-notice.html',
  'load-layout.js',
  'lounge-licht21.html',
  'mamachae.html',
  'membership.html',
  'mypage.html',
  'notice.html',
  'online-consultation.html',
  'privacy.html',
  'register.html',
  'room-deluxe-residence.html',
  'room-deluxe.html',
  'room-premier-boutique.html',
  'room-suite.html',
  'rooms.html',
  'sauna.html',
  'sizzling-house.html',
  'soleado.html',
  'special-offer.html',
  'terms.html',
  'untact.html',
  'urban-oasis-membership.html',
  'urban-oasis.html',
  'via-latte.html',
  'wedding.html',
];

console.log('[v0] Starting hotel name replacement...');

files.forEach(file => {
  const filePath = path.join(__dirname, file);
  
  try {
    if (fs.existsSync(filePath)) {
      let content = fs.readFileSync(filePath, 'utf8');
      
      replacements.forEach(({ from, to }) => {
        content = content.replace(from, to);
      });
      
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`[v0] ✓ Updated ${file}`);
    } else {
      console.log(`[v0] ⚠ File not found: ${file}`);
    }
  } catch (error) {
    console.error(`[v0] ✗ Error processing ${file}:`, error.message);
  }
});

console.log('[v0] Replacement complete!');
