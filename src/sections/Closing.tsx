import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Mail, Instagram, Youtube, Facebook, MessageCircle } from 'lucide-react';
import { getSettings } from '@/lib/store';

gsap.registerPlugin(ScrollTrigger);

export default function Closing() {
  const sectionRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const [settings, setSettings] = useState(getSettings());

  useEffect(() => {
    // Listen for storage changes in case settings are updated
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'kmf_settings') {
        setSettings(getSettings());
      }
    };
    window.addEventListener('storage', handleStorageChange);

    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(ctaRef.current,
        { y: 50, opacity: 0 },
        {
          y: 0, opacity: 1,
          scrollTrigger: { trigger: section, start: 'top 80%', end: 'top 50%', scrub: true }
        }
      );
      gsap.fromTo(cardsRef.current,
        { x: 50, opacity: 0 },
        {
          x: 0, opacity: 1,
          scrollTrigger: { trigger: section, start: 'top 80%', end: 'top 50%', scrub: true }
        }
      );
    }, section);

    return () => {
      ctx.revert();
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="w-full bg-charcoal grain-overlay py-16 md:py-24 px-[5vw]"
    >
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">
        {/* CTA Card */}
        <div ref={ctaRef} className="flex-1 kcard-lime p-8 md:p-12 flex flex-col justify-center">
          <h2 className="kheading text-[clamp(2rem,4vw,3.5rem)] text-nearblack mb-4 leading-tight uppercase">
            SIAP JADI BAGIAN DARI {settings.eventName}?
          </h2>
          <p className="font-body text-nearblack/80 text-base md:text-lg mb-6 max-w-lg">
            Slot terbatas. Daftar sebelum {new Date(settings.registrationDeadline).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })} untuk mendapatkan posisi terbaik.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => document.getElementById('register')?.scrollIntoView({ behavior: 'smooth' })}
              className="kbtn-secondary"
            >
              Daftar Sekarang
            </button>
            <a
              href={`mailto:${settings.email}`}
              className="kbtn bg-white text-nearblack flex items-center justify-center gap-2"
            >
              <Mail className="w-5 h-5" />
              Kirim Email
            </a>
          </div>
        </div>

        {/* Side Cards */}
        <div ref={cardsRef} className="lg:w-[320px] flex flex-col gap-5">
          {/* Contact */}
          <div className="kcard-lavender p-5">
            <h3 className="font-display font-bold text-nearblack text-lg mb-3">Hubungi Kami</h3>
            <div className="space-y-2">
              <p className="font-body text-nearblack/80 text-sm truncate">{settings.email}</p>
              <p className="font-body text-nearblack/80 text-sm">+{settings.whatsappNumber.replace(/^62/, '62 ')}</p>
            </div>
            <a
              href={`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(`Halo, saya ingin bertanya tentang ${settings.eventName}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 kbtn bg-[#25D366] text-white border-nearblack flex items-center justify-center gap-2 text-sm w-full py-2"
            >
              <MessageCircle className="w-4 h-4" />
              Chat WhatsApp
            </a>
          </div>

          {/* Social */}
          <div className="kcard-mint p-5">
            <h3 className="font-display font-bold text-nearblack text-lg mb-3">Ikuti Kami</h3>
            <div className="flex gap-3">
              {[
                { icon: Instagram, href: settings.instagramUrl, show: settings.showInstagram },
                { icon: Youtube, href: settings.youtubeUrl, show: settings.showYoutube },
                { icon: Facebook, href: settings.facebookUrl, show: settings.showFacebook },
              ].filter(item => item.show).map(({ icon: Icon, href }, i) => (
                <a key={i} href={href} target="_blank" rel="noopener noreferrer"
                  className="w-10 h-10 bg-white rounded-xl border-[2px] border-nearblack flex items-center justify-center hover:bg-lime transition-colors">
                  <Icon className="w-5 h-5 text-nearblack" />
                </a>
              ))}
              <a href={`https://wa.me/${settings.whatsappNumber}`} target="_blank" rel="noopener noreferrer"
                className="w-10 h-10 bg-[#25D366] rounded-xl border-[2px] border-nearblack flex items-center justify-center hover:scale-105 transition-transform">
                <MessageCircle className="w-5 h-5 text-white" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="kcard-sky p-5">
            <h3 className="font-display font-bold text-nearblack text-lg mb-3">Menu Cepat</h3>
            <div className="space-y-2">
              {[['#about', 'Tentang Event'], ['#slots', 'Daftar Slot'], ['#partnership', 'Kemitraan']].map(([href, label]) => (
                <a key={href} href={href} className="block font-body text-nearblack/80 text-sm hover:text-nearblack transition-colors">{label}</a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-10 pt-6 border-t-2 border-white/20">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-body text-white/60 text-sm text-center md:text-left">
            © {new Date().getFullYear()} {settings.eventName}. {settings.organizerName}.
          </p>
          <div className="flex gap-6">
            <a href="/privacy" className="font-body text-white/60 text-sm hover:text-white transition-colors">Kebijakan Privasi</a>
            <a href="/terms" className="font-body text-white/60 text-sm hover:text-white transition-colors">Syarat & Ketentuan</a>
          </div>
        </div>
      </div>
    </section>
  );
}
