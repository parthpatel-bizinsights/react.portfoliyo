import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface TimelineItem {
  year: string;
  role: string;
  company: string;
  description: string;
}

const TIMELINE_DATA: TimelineItem[] = [
  // {
  //   year: "2024 - Present",
  //   role: "Lead Full Stack Architect",
  //   company: "NextGen Solutions",
  //   description:
  //     "Leading a core team developing modern high-performance cloud platforms. Architecting scalable React apps, microservices, and implementing immersive 3D/WebGL experiences.",
  // },
  {
    year: "September 2025 - Present",
    role: "Full Stack Developer",
    company: "Biz-Insights",
    description:
      "Developed premium interactive user interfaces with advanced GSAP animations and Tailwind styling. Boosted core web performance by 40% and launched 15+ responsive platforms.",
  },
  {
    year: "June 2025 - September 2025",
    role: "Intern Full Stack Developer",
    company: "Biz-Insights",
    description:
      "Designed database schemas with MySQL and built robust REST APIs in Node.js/Express. Created clean UI dashboards and deployed client admin dashboards.",
  },
];

export const Timeline: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;

    // Get total length of path
    const pathLength = path.getTotalLength();

    // Set initial dash attributes to hide the path
    gsap.set(path, {
      strokeDasharray: pathLength,
      strokeDashoffset: pathLength,
    });

    const ctx = gsap.context(() => {
      // 1. Draw SVG path as user scrolls through the timeline container
      gsap.to(path, {
        strokeDashoffset: 0,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 70%",
          end: "bottom 75%",
          scrub: true,
        },
      });

      // 2. Slide/fade each card and active glowing node in sequence
      TIMELINE_DATA.forEach((_, idx) => {
        const cardClass = `.timeline-card-${idx}`;
        const nodeClass = `.timeline-node-${idx}`;

        gsap.fromTo(
          cardClass,
          { opacity: 0, x: idx % 2 === 0 ? -60 : 60, scale: 0.95 },
          {
            opacity: 1,
            x: 0,
            scale: 1,
            duration: 1.2,
            ease: "back.out(1.2)",
            scrollTrigger: {
              trigger: cardClass,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          },
        );

        gsap.fromTo(
          nodeClass,
          { scale: 0, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.6,
            ease: "elastic.out(1.2, 0.5)",
            scrollTrigger: {
              trigger: nodeClass,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          },
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-4xl mx-auto py-12 px-4"
    >
      {/* 3D-effect dynamic connecting vertical path */}
      <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-1">
        {/* Underlay tracking track */}
        <div className="w-full h-full bg-slate-200/50 rounded-full" />

        {/* Dynamic active SVG path overlay */}
        <svg
          className="absolute top-0 left-1/2 -translate-x-1/2 h-full w-2 overflow-visible pointer-events-none"
          preserveAspectRatio="none"
        >
          <path
            ref={pathRef}
            d={`M 4,0 L 4,10000`} // Long line stretching down
            stroke="url(#timeline-grad)"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
            className="timeline-path"
            style={{ filter: "drop-shadow(0 0 4px rgba(37,99,235,0.35))" }}
          />
          <defs>
            <linearGradient
              id="timeline-grad"
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#2563eb" />
              <stop offset="50%" stopColor="#0ea5e9" />
              <stop offset="100%" stopColor="#4f46e5" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Career items loop */}
      <div className="flex flex-col gap-16 relative">
        {TIMELINE_DATA.map((item, idx) => {
          const isLeft = idx % 2 === 0;

          return (
            <div
              key={idx}
              className={`flex flex-col md:flex-row items-center w-full relative ${
                isLeft ? "md:justify-start" : "md:justify-end"
              }`}
            >
              {/* Connecting glowing dot node */}
              <div
                className={`timeline-node-${idx} absolute left-1/2 -translate-x-1/2 w-6 h-6 rounded-full border-4 border-slate-50 flex items-center justify-center shadow-md z-10 transition-colors duration-300 ${
                  idx === 0
                    ? "bg-blue-600 shadow-blue-500/50 shadow-lg"
                    : idx === 1
                      ? "bg-sky-500 shadow-sky-400/50 shadow-lg"
                      : "bg-indigo-600 shadow-indigo-500/50 shadow-lg"
                }`}
              >
                {/* Node center ping pulse */}
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-30 bg-inherit" />
              </div>

              {/* Career details content card */}
              <div
                className={`timeline-card-${idx} w-full md:w-[45%] glass-panel p-6 shadow-sm relative group hover:border-blue-300/40 duration-300 ${
                  isLeft ? "md:mr-auto" : "md:ml-auto"
                }`}
              >
                {/* Visual arrow pointer (CSS indicator) */}
                <div
                  className={`hidden md:block absolute top-6.5 w-3 h-3 bg-white/70 border-t border-l border-white/20 backdrop-blur-xl rotate-135 z-0 ${
                    isLeft
                      ? "-right-1.75 border-r border-b border-t-0 border-l-0"
                      : "-left-1.75"
                  }`}
                />

                {/* Subtitle / Date */}
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-3 py-1 text-xxs font-bold tracking-wider rounded-full bg-blue-50 border border-blue-100 text-blue-600 uppercase shadow-xxs">
                    {item.year}
                  </span>
                </div>

                {/* Role Header */}
                <h3 className="text-xl font-bold text-slate-800 tracking-tight group-hover:text-blue-600 duration-300">
                  {item.role}
                </h3>

                {/* Company Name */}
                <span className="text-sm font-semibold text-slate-500 block mb-3">
                  {item.company}
                </span>

                {/* Job Description details */}
                <p className="text-slate-600 text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
