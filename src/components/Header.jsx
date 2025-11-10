import { useEffect, useRef, useState } from 'react';
import './Header.css';

const navigation = [
  { label: 'Start', href: '#hero' },
  { label: 'Über uns', href: '#about' },
  { label: 'Kontakt', href: '#contact' },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const overlayRef = useRef(null);
  const toggleBtnRef = useRef(null);

  // Close on route/hash change (clicking a link)
  useEffect(() => {
    const onClick = (e) => {
      const el = e.target instanceof Element ? e.target : e.target?.parentElement;
      const anchor = el?.closest?.('a[href]');
      if (!anchor) return;
      // Close menu when any link inside overlay is clicked
      if (overlayRef.current && overlayRef.current.contains(anchor)) {
        setOpen(false);
      }
    };
    window.addEventListener('click', onClick);
    return () => window.removeEventListener('click', onClick);
  }, []);

  // Handle Escape and focus trap while open
  useEffect(() => {
    const onKeyDown = (e) => {
      if (!open) return;
      if (e.key === 'Escape') {
        e.preventDefault();
        setOpen(false);
        toggleBtnRef.current?.focus();
        return;
      }
      if (e.key === 'Tab') {
        const root = overlayRef.current;
        if (!root) return;
        const list = Array.from(
          root.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')
        );
        // Include the toggle button (close button) to keep it reachable
        if (toggleBtnRef.current) list.push(toggleBtnRef.current);
        if (!list.length) return;
        const first = list[0];
        const last = list[list.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open]);

  // Body scroll-lock on html element
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('no-scroll', open);
    return () => {
      root.classList.remove('no-scroll');
    };
  }, [open]);

  return (
    <>
      <header className="header">
        <div className="container header__inner">
          <a className="header__logo" href="/schnitter" aria-label="Schnitter GbR Haustechnik">
            <img
              className="header__logo-img"
              src="images/Schnitter-GBR-Logo.png"
              alt="Schnitter GbR Haustechnik Logo"
            />
          </a>

          {/* Desktop nav (hidden on mobile) */}
          <nav className="header__nav" aria-label="Hauptnavigation" role="navigation">
            {navigation.map((item) => (
              <a key={item.label} href={`/schnitter/${item.href}`} className="header__link">
                {item.label}
              </a>
            ))}
          </nav>

          {/* Mobile hamburger */}
          <button
            ref={toggleBtnRef}
            className="nav-toggle"
            aria-controls="site-nav"
            aria-expanded={open}
            aria-label={open ? 'Menü schließen' : 'Menü öffnen'}
            onClick={() => setOpen((v) => !v)}
          >
            <span aria-hidden="true" className="nav-toggle__icon">☰</span>
          </button>
        </div>
      </header>

      {/* Overlay nav for mobile */}
      <nav
        id="site-nav"
        ref={overlayRef}
        className={`nav-overlay${open ? ' is-open' : ''}`}
        aria-hidden={!open}
        aria-label="Hauptnavigation"
        role="navigation"
        onMouseDown={(e) => {
          // Close if clicking on the overlay background (outside the list)
          if (e.target === e.currentTarget) {
            setOpen(false);
          }
        }}
      >
        <ul className="nav-list">
          {navigation.map((item) => (
            <li key={item.label}>
              <a className="nav-link" href={`/schnitter/${item.href}`}>{item.label}</a>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
