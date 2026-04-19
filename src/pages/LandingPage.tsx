import Navigation from '@/sections/Navigation';
import Hero from '@/sections/Hero';
import About from '@/sections/About';
import Experience from '@/sections/Experience';
import Slots from '@/sections/Slots';
import Partnership from '@/sections/Partnership';
import MediaPartners from '@/sections/MediaPartners';
import Registration from '@/sections/Registration';
import Closing from '@/sections/Closing';
import { useEffect } from 'react';
import { getSettings } from '@/lib/store';

export default function LandingPage() {
  const settings = getSettings();

  useEffect(() => {
    // Update Tab Title
    if (settings.metaTitle) {
      document.title = settings.metaTitle;
    } else if (settings.eventName) {
      document.title = settings.eventName;
    }

    // Update Meta Description
    if (settings.metaDescription) {
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute('content', settings.metaDescription);
    }
  }, [settings.metaTitle, settings.metaDescription, settings.eventName]);
  return (
    <div className="relative bg-neon min-h-screen">
      <Navigation />
      <main className="relative">
        <Hero />
        <About />
        <Experience />
        <Slots />
        <Partnership />
        <MediaPartners />
        <Registration />
        <Closing />
      </main>
    </div>
  );
}
