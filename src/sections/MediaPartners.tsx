import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Building2 } from 'lucide-react';
import { getMediaPartners, getSettings } from '@/lib/store';

gsap.registerPlugin(ScrollTrigger);

export default function MediaPartners() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const [partners, setPartners] = useState(getMediaPartners());
  const settings = getSettings();

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'kmf_media_partners') {
        setPartners(getMediaPartners());
      }
    };
    window.addEventListener('storage', handleStorageChange);

    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(headingRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1,
          scrollTrigger: { trigger: headingRef.current, start: 'top 85%', end: 'top 65%', scrub: true }
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
      id="media-partners"
      className="w-full bg-neon py-16 md:py-24 px-[5vw]"
    >
      <div ref={headingRef} className="text-center mb-10">
        <h2 className="kheading text-[clamp(2rem,4vw,3.5rem)] text-nearblack mb-3">
          Media Partner
        </h2>
        <p className="font-body text-nearblack/80 text-base md:text-lg max-w-2xl mx-auto">
          Terima kasih kepada mitra yang menyebarkan cerita KeMetroFest ke seluruh penjuru.
        </p>
      </div>

      {partners.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5 max-w-4xl mx-auto mb-10">
          {partners.map((partner) => (
            <div
              key={partner.id}
              className="bg-white rounded-3xl border-[3px] border-nearblack p-5 flex flex-col items-center justify-center gap-3 transition-transform duration-300 hover:-translate-y-1 aspect-square"
            >
              {partner.logo ? (
                <img src={partner.logo} alt={partner.name} className="w-16 h-16 md:w-20 md:h-20 object-contain" />
              ) : (
                <Building2 className="w-10 h-10 md:w-12 md:h-12 text-nearblack/50" strokeWidth={2} />
              )}
              <span className="font-accent font-semibold text-nearblack text-sm text-center">{partner.name}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="max-w-xl mx-auto mb-10 p-8 rounded-3xl border-[3px] border-nearblack border-dashed bg-white/50 text-center">
          <p className="font-body text-nearblack/60">Belum ada Media Partner yang terdaftar.</p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <a 
          href={`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(settings.waTemplateMedia || 'Halo Admin KeMetroFest, kami tertarik untuk menjadi Media Partner.')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="kbtn-primary"
        >
          Jadi Media Partner
        </a>
        <a href="#sponsors" className="kbtn bg-white text-nearblack hover:bg-nearblack hover:text-white">
          Sponsor Kami
        </a>
      </div>
    </section>
  );
}
