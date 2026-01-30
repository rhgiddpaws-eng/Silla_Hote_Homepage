'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const USER_KEY = 'shillastay_user';

export default function Header() {
  const pathname = usePathname();
  const [user, setUser] = useState<{ email?: string; name?: string } | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const raw = typeof window !== 'undefined' ? sessionStorage.getItem(USER_KEY) : null;
      setUser(raw ? JSON.parse(raw) : null);
    } catch {
      setUser(null);
    }
  }, [pathname]);

  useEffect(() => {
    const header = document.querySelector('.header');
    const toggle = document.querySelector('.menu-toggle');
    const overlay = document.querySelector('.nav-overlay');
    function close() {
      header?.classList.remove('nav-open');
      document.body.style.overflow = '';
    }
    toggle?.addEventListener('click', () => {
      if (header?.classList.contains('nav-open')) close();
      else {
        header?.classList.add('nav-open');
        document.body.style.overflow = 'hidden';
      }
    });
    overlay?.addEventListener('click', close);
    return () => {
      toggle?.removeEventListener('click', close as () => void);
      overlay?.removeEventListener('click', close);
    };
  }, [mounted]);

  function handleLogout() {
    sessionStorage.removeItem(USER_KEY);
    setUser(null);
    window.location.reload();
  }

  return (
    <header className="header">
      <div className="header-inner">
        <h1 className="logo">
          <Link href="/">신라스테이</Link>
        </h1>
        <div className="lang">
          <a href="?lang=ko" className="active">한국어</a>
          <a href="?lang=en">English</a>
        </div>
        <nav className="nav" aria-label="주 메뉴">
          <ul className="nav-list">
            <li><Link href="/rooms">Room Reservation</Link></li>
            <li><Link href="/special-offer">Special Offer</Link></li>
            <li className="has-drop">
              <Link href="/rooms">Rooms</Link>
              <ul className="drop">
                <li><Link href="/room-deluxe">Deluxe</Link></li>
                <li><Link href="/room-deluxe-residence">Deluxe Residence</Link></li>
                <li><Link href="/room-suite">Suite</Link></li>
              </ul>
            </li>
            <li className="has-drop">
              <Link href="/dining">F&B</Link>
              <ul className="drop">
                <li><Link href="/sizzling-house">Sizzling House</Link></li>
                <li><Link href="/via-latte">Via Latte</Link></li>
                <li><Link href="/lounge-licht21">The Lounge Licht 21</Link></li>
                <li><Link href="/beijing">Beijing</Link></li>
                <li><Link href="/mamachae">MamaChae</Link></li>
              </ul>
            </li>
            <li className="has-drop">
              <Link href="/urban-oasis">Urban Oasis</Link>
              <ul className="drop">
                <li><Link href="/lagoon-pool">Lagoon Pool</Link></li>
                <li><Link href="/fitness">Fitness</Link></li>
                <li><Link href="/lagoon-lounge">Lagoon Lounge</Link></li>
                <li><Link href="/sauna">Sauna</Link></li>
              </ul>
            </li>
            <li className="has-drop">
              <Link href="/convention-wedding">Convention & Wedding</Link>
              <ul className="drop">
                <li><Link href="/convention">Convention</Link></li>
                <li><Link href="/wedding">Wedding</Link></li>
              </ul>
            </li>
            <li className="has-drop">
              <Link href="/faq">Customer Service</Link>
              <ul className="drop">
                <li><Link href="/convenience-services">Convenience Services</Link></li>
                <li><Link href="/floor-guide">Floor Guide</Link></li>
                <li><Link href="/directions">Directions</Link></li>
                <li><Link href="/notice">Notice</Link></li>
                <li><Link href="/faq">FAQ</Link></li>
                <li><Link href="/online-consultation">Online Consultation</Link></li>
              </ul>
            </li>
            <li><Link href="/enford-hotel">#SHILLA STAY</Link></li>
            <li><Link href="/membership">#MEMBERSHIP</Link></li>
          </ul>
        </nav>
        <div className="header-actions">
          {mounted && user?.email ? (
            <span className="header-user" id="headerUser">
              <Link href="/mypage">{user.name || user.email}</Link>
              <button type="button" id="headerLogout" onClick={handleLogout}>로그아웃</button>
            </span>
          ) : (
            <>
              <Link href="/login" className="btn-text" id="headerLogin">Login</Link>
              <Link href="/register" className="btn-text" id="headerRegister">Register</Link>
            </>
          )}
        </div>
        <button type="button" className="menu-toggle" aria-label="메뉴 열기">
          <span></span><span></span><span></span>
        </button>
      </div>
      <div className="nav-overlay"></div>
    </header>
  );
}
