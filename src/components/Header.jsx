import './Header.css';

const navigation = [
  { label: 'Start', href: '#hero' },
  { label: 'Leistungen', href: '#services' },
  { label: 'Über uns', href: '#about' },
  { label: 'Ablauf', href: '#process' },
  { label: 'Kontakt', href: '#contact' },
];

export function Header() {
  return (
    <header className="header">
      <div className="container header__inner">
        <a className="header__logo" href="#hero" aria-label="Schnitter Haustechnik">
          <img className="header__logo-img" src="/images/Schnitter-GBR.png" alt="Schnitter Haustechnik Logo" />
        </a>
        <nav className="header__nav">
          {navigation.map((item) => (
            <a key={item.label} href={item.href} className="header__link">
              {item.label}
            </a>
          ))}
        </nav>
        <a className="accent-button header__cta" href="tel:+49891234567">
          Jetzt anrufen
        </a>
      </div>
    </header>
  );
}
