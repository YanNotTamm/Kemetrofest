import { useEffect, useState } from 'react';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface CountdownTimerProps {
  targetDate: string;
  targetTime: string;
}

function calculateTimeLeft(targetDate: string, targetTime: string): TimeLeft {
  const target = new Date(`${targetDate}T${targetTime}:00+07:00`);
  const now = new Date();
  const diff = target.getTime() - now.getTime();

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="w-14 h-14 md:w-16 md:h-16 bg-white rounded-2xl border-[3px] border-nearblack flex items-center justify-center shadow-hard-sm">
        <span className="font-display font-black text-nearblack text-xl md:text-2xl">
          {String(value).padStart(2, '0')}
        </span>
      </div>
      <span className="font-accent font-semibold text-nearblack/70 text-[10px] md:text-xs uppercase tracking-wider mt-2">
        {label}
      </span>
    </div>
  );
}

export default function CountdownTimer({ targetDate, targetTime }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => calculateTimeLeft(targetDate, targetTime));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate, targetTime));
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate, targetTime]);

  const isEventStarted =
    timeLeft.days === 0 &&
    timeLeft.hours === 0 &&
    timeLeft.minutes === 0 &&
    timeLeft.seconds === 0;

  if (isEventStarted) {
    return (
      <div className="flex items-center gap-3">
        <div className="w-3 h-3 bg-coral rounded-full animate-pulse" />
        <span className="font-display font-bold text-nearblack text-lg">
          EVENT SEDANG BERLANGSUNG!
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 md:gap-4">
      <CountdownUnit value={timeLeft.days} label="Hari" />
      <span className="font-display font-black text-nearblack text-xl mt-[-16px]">:</span>
      <CountdownUnit value={timeLeft.hours} label="Jam" />
      <span className="font-display font-black text-nearblack text-xl mt-[-16px]">:</span>
      <CountdownUnit value={timeLeft.minutes} label="Menit" />
      <span className="font-display font-black text-nearblack text-xl mt-[-16px]">:</span>
      <CountdownUnit value={timeLeft.seconds} label="Detik" />
    </div>
  );
}
