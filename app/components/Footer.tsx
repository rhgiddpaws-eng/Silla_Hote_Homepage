import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">신라스테이</div>
        <div className="footer-links">
          <Link href="/">Shilla Stay Hotel</Link>
          <Link href="/floor-guide">Floor Guide</Link>
          <Link href="/membership">Membership</Link>
          <Link href="/faq">FAQ</Link>
          <Link href="/online-consultation">Online Consultation</Link>
          <Link href="/notice">Notice</Link>
        </div>
        <div className="footer-legal">
          <Link href="/terms">Terms of Service</Link>
          <Link href="/privacy">Privacy Policy</Link>
          <Link href="/privacy#email">Email Collection Policy</Link>
          <Link href="/legal-notice">Legal Notice</Link>
          <Link href="/privacy#video">Video Information Processing Policy</Link>
        </div>
        <p className="footer-info">Business Registration Number: 123-45-67890</p>
        <address className="footer-address">
          249, Dongho-ro, Jung-gu, Seoul, Republic of Korea<br />
          Tel: +82-2-2230-0700 · Fax: +82-2-2230-0800
        </address>
        <p className="footer-copy">COPYRIGHT SHILLA STAY HOTEL. ALL RIGHTS RESERVED.</p>
      </div>
    </footer>
  );
}
