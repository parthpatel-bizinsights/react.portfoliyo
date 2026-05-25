import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface StatsCardProps {
  targetValue: number;
  suffix?: string;
  label: string;
  icon: React.ReactNode;
}

export const StatsCard: React.FC<StatsCardProps> = ({ targetValue, suffix = '', label, icon }) => {
  const [count, setCount] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const counterObj = useRef({ val: 0 });

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(counterObj.current, {
        val: targetValue,
        duration: 2.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: cardRef.current,
          start: 'top 85%', // starts counting when 85% of viewport is reached
          toggleActions: 'play none none none',
        },
        onUpdate: () => {
          setCount(Math.floor(counterObj.current.val));
        },
      });
    }, cardRef);

    return () => ctx.revert();
  }, [targetValue]);

  return (
    <div
      ref={cardRef}
      className="glass-panel flex flex-col p-6 items-center text-center relative overflow-hidden group hover:-translate-y-1.5 duration-300"
    >
      {/* Decorative glow backing */}
      <div className="absolute -top-12 -right-12 w-24 h-24 bg-blue-600/5 rounded-full blur-2xl group-hover:scale-150 transition-all duration-500" />
      
      {/* Dynamic Floating Icon */}
      <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl mb-4 group-hover:scale-110 duration-300 shadow-sm border border-blue-100/50">
        {icon}
      </div>

      {/* Dynamic Animated Value */}
      <span className="text-4xl font-extrabold text-slate-800 tracking-tight glow-text-blue select-none mb-1">
        {count}
        {suffix}
      </span>

      {/* Label */}
      <span className="text-sm font-semibold text-slate-500 tracking-wide uppercase">
        {label}
      </span>
    </div>
  );
};
