import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MessageCircle, Crown, Gem, Award, Building2 } from 'lucide-react';
import { getTiers, getSettings, getPartners } from '@/lib/store';
import type { PartnershipTier, PartnerData } from '@/lib/store';

gsap.registerPlugin(ScrollTrigger);

const iconMap: Record<string, typeof Crown> = { crown: Crown, gem: Gem, award: Award };

function TierIcon({ tier }: { tier: PartnershipTier }) {
  const Icon = iconMap[tier.icon] || Award;
  return <Icon className="w-7 h-7 md:w-8 md:h-8 text-nearblack" strokeWidth={2.5} />;
}

export default function Partnership() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const tierRefs = useRef<HTMLDivElement[]>([]);
  
  const [activeSponsors, setActiveSponsors] = useState<PartnerData[]>([]);

  const tiers = getTiers();
  const settings = getSettings();

  useEffect(() => {
    // Initial load
    setActiveSponsors(getPartners().filter(p => p.status === 'active' && p.type === 'sponsor'));

    // Listen for changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'kmf_partners') {
        setActiveSponsors(getPartners().filter(p => p.status === 'active' && p.type === 'sponsor'));
      }
    };
    window.addEventListener('storage', handleStorageChange);
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(titleRef.current,
        { x: -60, opacity: 0 },
        {
          x: 0, opacity: 1,
          scrollTrigger: { trigger: titleRef.current, start: 'top 85%', end: 'top 55%', scrub: true }
        }
      );

      tierRefs.current.forEach((tier) => {
        if (!tier) return;
        gsap.fromTo(tier,
          { y: 40, opacity: 0 },
          {
            y: 0, opacity: 1,
            scrollTrigger: { trigger: tier, start: 'top 90%', end: 'top 65%', scrub: true }
          }
        );
      });
    }, section);

    return () => {
      ctx.revert();
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="partnership"
      className="w-full bg-neon pattern-diagonal pt-10 md:pt-12 pb-16 md:pb-24 px-[5vw]"
    >
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">
        {/* Title Card */}
        <div ref={titleRef} className="lg:w-[36%] kcard-lavender p-6 md:p-10 flex flex-col justify-center lg:sticky lg:top-24 lg:self-start">
          <h2 className="kheading text-[clamp(1.8rem,3.5vw,3rem)] text-nearblack mb-4">
            Kemitraan
          </h2>
          <p className="font-body text-nearblack/80 text-base md:text-lg mb-6">
            Jadikan merek Anda bagian dari festival kota. Dapatkan exposure maksimal kepada ribuan pengunjung.
          </p>
          <a
            href={`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(settings.waTemplatePartner || 'Halo Admin KeMetroFest, saya tertarik menjadi mitra dan ingin meminta proposal.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="kbtn-secondary w-fit flex items-center gap-2"
          >
            <MessageCircle className="w-5 h-5" />
            Minta Proposal
          </a>
        </div>

        {/* Tier Cards */}
        <div className="flex-1 space-y-5">
          {tiers.map((tier, i) => (
            <div
              key={tier.id}
              ref={el => { if (el) tierRefs.current[i] = el; }}
              className={`${tier.color} rounded-4xl border-[3px] border-nearblack shadow-hard p-6 md:p-8`}
            >
              <div className="flex items-start gap-4 md:gap-6">
                <div className="w-14 h-14 md:w-16 md:h-16 bg-white rounded-2xl border-[3px] border-nearblack flex items-center justify-center flex-shrink-0">
                  <TierIcon tier={tier} />
                </div>
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-3">
                    <h3 className="font-display font-bold text-nearblack text-xl md:text-2xl">{tier.name}</h3>
                    <span className="font-display font-black text-nearblack text-lg md:text-xl">{tier.price}</span>
                  </div>
                  <p className="font-body text-nearblack/80 text-sm md:text-base leading-relaxed">{tier.benefits}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Sponsors Display */}
      {activeSponsors.length > 0 && (
        <div id="sponsors" className="mt-12 border-t-4 border-nearblack pt-12 scroll-mt-24">
          <h3 className="kheading text-center text-[clamp(1.5rem,3vw,2.5rem)] text-nearblack mb-10">
            Didukung Oleh
          </h3>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 max-w-5xl mx-auto">
            {activeSponsors.map((sponsor) => {
              const sponsorTier = sponsor.tier ? tiers.find(t => t.name.toLowerCase() === sponsor.tier?.toLowerCase()) : null;
              const badgeBg = sponsorTier ? sponsorTier.color : 'bg-nearblack';
              // If background is dark, text should be white. But bg-mint/bg-sky/bg-cream are light colors in this theme!
              // Wait, bg-mint/sky/cream are light colors, so text should be nearblack.
              const badgeTextClass = badgeBg === 'bg-nearblack' ? 'text-white' : 'text-nearblack';
              
              return (
                <div
                  key={sponsor.id}
                  className="bg-white w-48 md:w-56 rounded-3xl border-[3px] border-nearblack p-5 flex flex-col items-center justify-center gap-3 transition-transform duration-300 hover:-translate-y-1 aspect-square"
                >
                  {sponsor.logo ? (
                    <img src={sponsor.logo} alt={sponsor.name} className="w-16 h-16 md:w-20 md:h-20 object-contain" />
                  ) : (
                    <Building2 className="w-10 h-10 md:w-12 md:h-12 text-nearblack/50" strokeWidth={2} />
                  )}
                  <span className="font-accent font-semibold text-nearblack text-sm text-center line-clamp-2">{sponsor.name}</span>
                  <span className={`inline-flex items-center gap-1.5 text-[10px] uppercase font-bold ${badgeTextClass} ${badgeBg} px-3 py-1 rounded-full border-[2px] border-nearblack`}>
                    <span className="text-sm leading-none">
                      {sponsorTier?.icon === 'crown' ? '👑' : sponsorTier?.icon === 'gem' ? '💎' : sponsorTier?.icon === 'award' ? '🏆' : '🏅'}
                    </span>
                    {sponsor.tier}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
