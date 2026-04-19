import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MessageCircle } from 'lucide-react';
import { getSettings } from '@/lib/store';

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const settings = getSettings();

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(photoRef.current,
        { x: -60, opacity: 0 },
        {
          x: 0, opacity: 1, duration: 0.7,
          scrollTrigger: { trigger: section, start: 'top 80%', end: 'top 40%', scrub: true }
        }
      );
      gsap.fromTo(cardRef.current,
        { x: 60, opacity: 0 },
        {
          x: 0, opacity: 1, duration: 0.7,
          scrollTrigger: { trigger: section, start: 'top 80%', end: 'top 40%', scrub: true }
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="w-full bg-neon pattern-diagonal py-16 md:py-24 px-[5vw]"
    >
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        {/* Photo */}
        <div ref={photoRef} className="lg:w-[45%] kcard-mint overflow-hidden flex-shrink-0 flex">
          <img
            src={settings.aboutImage}
            alt="Cooking Action"
            className="w-full h-full min-h-[300px] md:min-h-[420px] object-cover"
          />
        </div>

        {/* Content */}
        <div ref={cardRef} className="flex-1 kcard-lavender p-6 md:p-10 flex flex-col justify-center">
          <div className="inline-flex items-center justify-center min-w-16 h-16 px-4 bg-lime rounded-full border-[3px] border-nearblack shadow-hard-sm mb-6">
            <span className="font-display font-black text-nearblack text-sm uppercase">{settings.aboutBadge}</span>
          </div>

          <h2 className="kheading text-[clamp(1.8rem,3.5vw,3rem)] text-nearblack mb-6">
            {settings.aboutTitle}
          </h2>

          <div className="space-y-4">
            {settings.aboutDescription.split('\n').filter(p => p.trim()).map((paragraph, idx) => (
              <p key={idx} className="font-body text-nearblack text-base md:text-lg leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>

          <a
            href={`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(settings.waTemplatePartner || 'Halo Admin KeMetroFest, saya tertarik menjadi mitra dan ingin meminta proposal.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 kbtn-secondary w-fit flex items-center gap-2"
          >
            <MessageCircle className="w-5 h-5" />
            Minta Proposal
          </a>
        </div>
      </div>
    </section>
  );
}
