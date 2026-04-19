import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MapPin, Phone, Mail, MessageCircle } from 'lucide-react';
import CountdownTimer from '@/components/CountdownTimer';
import { getSettings } from '@/lib/store';

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const heroCardRef = useRef<HTMLDivElement>(null);
  const sideCardsRef = useRef<HTMLDivElement>(null);
  const countdownRef = useRef<HTMLDivElement>(null);

  const settings = getSettings();

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo(heroCardRef.current,
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7 },
        0
      )
      .fromTo(sideCardsRef.current,
        { x: 60, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.7 },
        0.2
      )
      .fromTo(countdownRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6 },
        0.4
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-screen bg-neon pattern-stars pt-28 md:pt-36 pb-12 px-[5vw]"
    >
      {/* Main layout */}
      <div className="flex flex-col lg:flex-row gap-5 lg:gap-6">
        {/* Left — Hero Card */}
        <div
          ref={heroCardRef}
          className="flex-1 kcard-lavender overflow-hidden flex flex-col"
        >
          <div className="relative w-full aspect-[16/8] overflow-hidden">
            <img
              src={settings.heroImage}
              alt={`${settings.eventName} — Festival Kuliner Kota Metro`}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-6 md:p-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h1 className="kheading text-[clamp(2.2rem,5vw,4rem)] text-nearblack leading-none">
                {settings.eventName}
              </h1>
              <p className="mt-2 text-nearblack/80 font-body text-base md:text-lg max-w-md">
                {settings.eventTagline}
              </p>
            </div>
            <button
              onClick={() => document.getElementById('register')?.scrollIntoView({ behavior: 'smooth' })}
              className="kbtn-primary text-sm whitespace-nowrap"
            >
              Daftarkan Tenant
            </button>
          </div>
        </div>

        {/* Right — Info Cards */}
        <div
          ref={sideCardsRef}
          className="lg:w-[320px] flex flex-col gap-5"
        >
          {/* Location */}
          <div className="kcard-sky p-5">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-5 h-5 text-nearblack" strokeWidth={2.5} />
              <span className="klabel text-nearblack">Lokasi</span>
            </div>
            <p className="font-display font-bold text-nearblack text-sm mb-1">{settings.locationName}</p>
            <p className="font-body text-nearblack/80 text-sm leading-relaxed">
              {settings.locationAddress}
            </p>
          </div>

          {/* Contact */}
          <div className="kcard-coral p-5">
            <div className="flex items-center gap-2 mb-3">
              <Phone className="w-5 h-5 text-nearblack" strokeWidth={2.5} />
              <span className="klabel text-nearblack">Kontak</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-nearblack" strokeWidth={2.5} />
                <p className="font-body text-nearblack text-sm break-all">{settings.email}</p>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-nearblack" strokeWidth={2.5} />
                <p className="font-body text-nearblack text-sm">
                  +{settings.whatsappNumber.replace(/^62/, '62 ').replace(/(\d{3})(\d{4})(\d+)/, '$1-$2-$3')}
                </p>
              </div>
            </div>
            <a
              href={`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent('Halo, saya ingin bertanya tentang KeMetroFest 2025')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 kbtn bg-[#25D366] text-white border-nearblack flex items-center justify-center gap-2 text-xs w-full py-2"
            >
              <MessageCircle className="w-4 h-4" />
              Chat WhatsApp
            </a>
          </div>

          {/* Schedule */}
          <div className="kcard-mint p-5">
            <p className="klabel text-nearblack/70 mb-1">Jadwal Event</p>
            <p className="font-display font-bold text-nearblack text-sm">
              {new Date(settings.startDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long' })}–{new Date(settings.endDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
            <p className="font-body text-nearblack/70 text-xs mt-0.5">
              {settings.startTime}–{settings.endTime} WIB
            </p>
          </div>
        </div>
      </div>

      {/* Countdown */}
      <div ref={countdownRef} className="mt-6 kcard-mint p-6 flex items-center justify-center">
        <div className="text-center">
          <p className="klabel text-nearblack/70 mb-3">Hitung Mundur Menuju Event</p>
          <CountdownTimer targetDate={settings.startDate} targetTime={settings.startTime} />
        </div>
      </div>
    </section>
  );
}
