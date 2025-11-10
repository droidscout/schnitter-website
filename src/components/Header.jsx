import './Header.css';

const navigation = [
  { label: 'Start', href: '#hero' },
  { label: 'Über uns', href: '#about' },
  { label: 'Kontakt', href: '#contact' },
];

export function Header() {
  return (
    <header className="header">
      <div className="container header__inner">
        <a className="header__logo" href="/schnitter" aria-label="Schnitter GbR Haustechnik">
          <img className="header__logo-img" src="images/Schnitter-GBR-Logo.png" alt="Schnitter GbR Haustechnik Logo" />
        </a>
        <nav className="header__nav">
          {navigation.map((item) => (
            <a key={item.label} href={`/schnitter/${item.href}`} className="header__link">
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
