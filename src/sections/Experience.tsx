import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getExperiences } from '@/lib/store';
import type { ExperienceItem } from '@/lib/store';

gsap.registerPlugin(ScrollTrigger);

export default function Experience() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const [experiences, setExperiences] = useState<ExperienceItem[]>(getExperiences());

  useEffect(() => {
    // Listen for storage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'kmf_experiences') {
        setExperiences(getExperiences());
      }
    };
    window.addEventListener('storage', handleStorageChange);

    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const cards = cardsContainerRef.current?.children;
      if (cards) {
        gsap.fromTo(cards,
          { y: 60, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.8,
            stagger: 0.2,
            scrollTrigger: {
              trigger: section,
              start: 'top 75%',
              end: 'top 30%',
              scrub: true
            }
          }
        );
      }
    }, section);

    return () => {
      ctx.revert();
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="experience"
      className="w-full bg-neon pattern-dots pt-16 md:pt-24 pb-10 md:pb-12 px-[5vw]"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h2 className="kheading text-[clamp(2.5rem,6vw,4.5rem)] text-nearblack mb-2">
              Pengalaman
            </h2>
            <p className="font-body text-nearblack/70 text-lg max-w-xl">
              Nostalgia kemeriahan KeMetroFest dari waktu ke waktu. Setiap momen membawa cerita unik dan kebahagiaan baru.
            </p>
          </div>
          
          <button
            onClick={() => document.getElementById('slots')?.scrollIntoView({ behavior: 'smooth' })}
            className="kbtn-primary w-fit hidden md:flex"
          >
            Lihat Slot Stand
          </button>
        </div>

        <div 
          ref={cardsContainerRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-12"
        >
          {experiences.map((exp) => (
            <div 
              key={exp.id}
              className="kcard group flex flex-col bg-white transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_0_#141414]"
            >
              {/* Image half */}
              <div className="relative h-56 overflow-hidden border-b-[3px] border-nearblack rounded-t-[31px]">
                <img
                  src={exp.image}
                  alt={exp.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-lime text-nearblack text-[10px] font-accent font-bold uppercase px-3 py-1 rounded-full border-2 border-nearblack">
                    {exp.series}
                  </span>
                </div>
              </div>

              {/* Content half */}
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="font-display font-black text-2xl text-nearblack leading-tight uppercase mb-3">
                  {exp.title}
                </h3>
                <p className="font-body text-nearblack/60 text-sm leading-relaxed mb-6 flex-1 line-clamp-4">
                  {exp.description}
                </p>
                <div className="pt-4 border-t-2 border-dashed border-gray-200 mt-auto">
                  <span className="text-[10px] font-accent font-bold text-nearblack/30 uppercase tracking-widest">
                    KeMetroFest Official
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => document.getElementById('slots')?.scrollIntoView({ behavior: 'smooth' })}
          className="mt-12 kbtn-primary w-full md:hidden"
        >
          Lihat Slot Stand
        </button>
      </div>
    </section>
  );
}
