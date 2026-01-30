import fs from 'fs';
import path from 'path';
import HtmlContent from '../components/HtmlContent';

const HTML_SLUGS = [
  [],
  ['beijing'],
  ['convenience-services'],
  ['convention-wedding'],
  ['convention'],
  ['dining'],
  ['directions'],
  ['enford-hotel'],
  ['faq'],
  ['fitness'],
  ['floor-guide'],
  ['lagoon-lounge'],
  ['lagoon-pool'],
  ['legal-notice'],
  ['login'],
  ['lounge-licht21'],
  ['mamachae'],
  ['membership'],
  ['mypage'],
  ['notice'],
  ['online-consultation'],
  ['privacy'],
  ['register'],
  ['room-deluxe-residence'],
  ['room-deluxe'],
  ['room-suite'],
  ['rooms'],
  ['sauna'],
  ['sizzling-house'],
  ['soleado'],
  ['special-offer'],
  ['terms'],
  ['untact'],
  ['urban-oasis-membership'],
  ['urban-oasis'],
  ['via-latte'],
  ['wedding'],
];

function extractBodyContent(html: string): string {
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  let body = bodyMatch ? bodyMatch[1] : html;
  body = body
    .replace(/<header[^>]*>[\s\S]*?<\/header>/gi, '')
    .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, '')
    .replace(/<div id="header-wrap"><\/div>/gi, '')
    .replace(/<div id="footer-wrap"><\/div>/gi, '')
    .replace(/<script[^>]*src="[^"]*load-layout\.js"[^>]*><\/script>/gi, '');
  body = body.replace(/\/public\/images\//g, '/images/');
  body = body.replace(/href="index\.html"/gi, 'href="/"');
  body = body.replace(/href="([^"]+)\.html"/gi, (_, name) => `href="/${name}"`);
  body = body.replace(/src="\/public\/images\//g, 'src="/images/');
  body = body.replace(/enford_user/g, 'shillastay_user');
  body = body.replace(/window\.location\.href\s*=\s*['"]index\.html['"]/g, "window.location.href = '/'");
  return body.trim();
}

function getHtmlPath(slug: string[] | undefined): string {
  const base = process.cwd();
  if (!slug || slug.length === 0) {
    return path.join(base, 'index.html');
  }
  return path.join(base, `${slug.join('/')}.html`);
}

export async function generateStaticParams() {
  return HTML_SLUGS.map((slug) => ({ slug }));
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const resolved = await params;
  const slug = resolved.slug ?? [];
  const filePath = getHtmlPath(slug);

  let bodyContent = '';
  try {
    const html = fs.readFileSync(filePath, 'utf8');
    bodyContent = extractBodyContent(html);
    const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';
    if (googleClientId && bodyContent.includes('YOUR_GOOGLE_CLIENT_ID')) {
      bodyContent = bodyContent.replace(/YOUR_GOOGLE_CLIENT_ID\.apps\.googleusercontent\.com/g, googleClientId);
    }
  } catch (err) {
    bodyContent = '<main class="main-content page-sub"><section class="section"><p>페이지를 찾을 수 없습니다.</p></section></main>';
  }

  return <HtmlContent html={bodyContent} />;
}
