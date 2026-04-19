import { useState, useEffect } from 'react';
import { getSettings } from '@/lib/store';

const navLinks = [
  { label: 'Beranda', href: '#' },
  { label: 'Tentang', href: '#about' },
  { label: 'Slot', href: '#slots' },
  { label: 'Kemitraan', href: '#partnership' },
  { label: 'Daftar', href: '#register' },
];

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [settings, setSettings] = useState(getSettings());

  useEffect(() => {
    // Listen for storage changes in case settings are updated
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'kmf_settings') {
        setSettings(getSettings());
      }
    };

    const handleScroll = () => setIsScrolled(window.scrollY > 80);

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href === '#') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      e.preventDefault();
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'py-2 bg-nearblack/80 backdrop-blur-md shadow-lg border-b border-white/10'
          : 'py-4 bg-gradient-to-b from-nearblack/90 via-nearblack/40 to-transparent'
      }`}
    >
      <div className={`px-[5vw] flex items-center justify-between transition-all duration-500 ${isScrolled ? 'h-16 md:h-20' : 'h-24 md:h-32'}`}>
        {/* Logo */}
        <a
          href="#"
          onClick={(e) => handleNavClick(e, '#')}
          className="flex-shrink-0 flex items-center"
        >
          {settings.logoImage ? (
            <img
              src={settings.logoImage}
              alt={settings.eventName}
              className={`w-auto object-contain transition-all duration-500 ${isScrolled ? 'h-14 md:h-16' : 'h-20 md:h-28'}`}
              style={{ background: 'transparent' }}
            />
          ) : (
            <span className="font-display font-black text-white text-xl md:text-2xl tracking-tight">
              {settings.eventName || 'KeMetroFest'}
            </span>
          )}
        </a>

        {/* Desktop nav — centered */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map(link => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="font-accent font-semibold text-white/90 text-sm uppercase tracking-wide hover:text-lime transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Mobile toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden w-10 h-10 bg-white/10 backdrop-blur rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors"
          >
            <div className="space-y-1.5">
              <span className={`block w-5 h-0.5 bg-white transition-all ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`block w-5 h-0.5 bg-white transition-all ${isMobileMenuOpen ? 'opacity-0' : ''}`} />
              <span className={`block w-5 h-0.5 bg-white transition-all ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-gradient-to-b from-[#6b2f00] to-[#1a0a00] border-b-2 border-orange-900/50 p-6">
          <div className="flex flex-col gap-4">
            {navLinks.map(link => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="font-accent font-semibold text-white text-lg uppercase tracking-wide hover:text-lime transition-colors"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#register"
              onClick={(e) => handleNavClick(e, '#register')}
              className="mt-2 px-6 py-3 bg-lime text-nearblack font-accent font-bold text-center rounded-full border-2 border-nearblack"
            >
              Daftar Sekarang
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
