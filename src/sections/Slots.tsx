import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { XCircle, ChevronRight, Users } from 'lucide-react';
import { getSlots, getSettings, getTenants } from '@/lib/store';

gsap.registerPlugin(ScrollTrigger);

export default function Slots() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<HTMLDivElement[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const slots = getSlots();
  const settings = getSettings();
  const tenants = getTenants();

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(headerRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1,
          scrollTrigger: { trigger: headerRef.current, start: 'top 85%', end: 'top 60%', scrub: true }
        }
      );

      cardRefs.current.forEach((card) => {
        if (!card) return;
        gsap.fromTo(card,
          { y: 40, opacity: 0 },
          {
            y: 0, opacity: 1,
            scrollTrigger: { trigger: card, start: 'top 90%', end: 'top 70%', scrub: true }
          }
        );
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="slots"
      className="w-full bg-neon py-10 md:py-12 px-[5vw]"
    >
      <div ref={headerRef} className="mb-10">
        <h2 className="kheading text-[clamp(2rem,4vw,3.5rem)] text-nearblack mb-3">
          Daftar Slot
        </h2>
        <p className="font-body text-nearblack/80 text-base md:text-lg max-w-2xl">
          Pilih blok yang sesuai dengan strategi stan Anda. Slot terbatas, segera amankan tempat!
        </p>
      </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {slots.map((slot, i) => {
            const filledCount = tenants.filter(t => t.block === slot.id && (t.status === 'approved' || t.status === 'pending')).length;
            const remainingCount = Math.max(0, slot.totalSlots - filledCount);
            const isAvailable = slot.available && remainingCount > 0;

            return (
              <div
                key={slot.id}
                ref={el => { if (el) cardRefs.current[i] = el; }}
                className={`kcard p-5 flex gap-5 transition-all duration-300 hover:-translate-y-1 cursor-pointer ${
                  selectedSlot === slot.id ? 'ring-4 ring-lime' : ''
                } ${!isAvailable ? 'opacity-60' : ''}`}
                onClick={() => isAvailable && setSelectedSlot(slot.id === selectedSlot ? null : slot.id)}
              >
                <div className="w-24 h-24 md:w-28 md:h-28 flex-shrink-0 rounded-2xl overflow-hidden border-[3px] border-nearblack">
                  <img src={slot.image || settings.slotImage} alt={slot.name} className="w-full h-full object-cover bg-gray-100" />
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-display font-bold text-nearblack text-lg">{slot.name}</h3>
                    </div>
                    <p className="font-body text-nearblack/70 text-sm leading-snug">{slot.position}</p>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border-[2px] ${
                      isAvailable ? 'bg-mint border-nearblack' : 'bg-coral/30 border-nearblack'
                    }`}>
                      {isAvailable ? <Users className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                      <span className="font-accent font-semibold text-xs uppercase">
                        {isAvailable ? `Sisa Slot: ${remainingCount}` : 'Penuh'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      {selectedSlot && (
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => document.getElementById('register')?.scrollIntoView({ behavior: 'smooth' })}
            className="kbtn-primary text-lg px-8 py-4 flex items-center gap-2"
          >
            Daftar di Slot {selectedSlot}
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </section>
  );
}
