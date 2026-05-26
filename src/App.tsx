import { useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CanvasFramePlayer } from "./components/CanvasFramePlayer";
import { SkillsOrbit } from "./components/SkillsOrbit";
import { StatsCard } from "./components/StatsCard";
import { Timeline } from "./components/Timeline";
import { ProjectsSection } from "./components/Projects";
import { SplashCursor } from "./components/Cursor";

gsap.registerPlugin(ScrollTrigger);

// Inline SVGs for perfect compilation and 100% reliability
const IconCalendar = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2"
  >
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const IconFolder = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
  </svg>
);

const IconUsers = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const IconCode = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2"
  >
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
  </svg>
);

export default function App() {
  const [activeSection, setActiveSection] = useState("hero");
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });
  const [cursorHover, setCursorHover] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Form State
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formMsg, setFormMsg] = useState("");
  const [formStatus, setFormStatus] = useState<"idle" | "success" | "error">(
    "idle",
  );

  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // --- Initialize Lenis Smooth Scroll ---
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Sync ScrollTrigger with Lenis scroll
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    // --- Active Section Tracker on Scroll ---
    const sections = [
      "hero",
      "about",
      "skills",
      "projects",
      "timeline",
      "services",
      "testimonials",
      "contact",
    ];
    sections.forEach((sec) => {
      ScrollTrigger.create({
        trigger: `#${sec}`,
        start: "top 40%",
        end: "bottom 40%",
        onEnter: () => setActiveSection(sec),
        onEnterBack: () => setActiveSection(sec),
      });
    });

    // --- Custom Interactive Cursor movement ---
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "BUTTON" ||
        target.tagName === "A" ||
        target.closest("button") ||
        target.closest("a") ||
        target.classList.contains("glass-panel")
      ) {
        setCursorHover(true);
      } else {
        setCursorHover(false);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseover", handleMouseOver);

    // Fade-in animations for section titles
    sections.forEach((sec) => {
      if (sec === "hero") return;
      gsap.fromTo(
        `#${sec} .section-title`,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1.0,
          ease: "power3.out",
          scrollTrigger: {
            trigger: `#${sec}`,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        },
      );
    });

    // Parallax floating background items in Hero
    gsap.to(".hero-float-1", {
      y: -80,
      rotation: 15,
      scrollTrigger: {
        trigger: "#hero",
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });
    gsap.to(".hero-float-2", {
      y: -120,
      rotation: -25,
      scrollTrigger: {
        trigger: "#hero",
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });

    return () => {
      lenis.destroy();
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  // Smooth scroll trigger handler helper
  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formEmail || !formMsg) {
      setFormStatus("error");
      return;
    }
    // Simulate successful API response
    setFormStatus("success");
    setTimeout(() => {
      setFormName("");
      setFormEmail("");
      setFormMsg("");
      setFormStatus("idle");
    }, 4000);
  };

  return (
    <div ref={mainRef} className="relative min-h-screen text-slate-800">
      {/* Immersive Scroll-Bound Image Sequence Canvas Background */}
      <CanvasFramePlayer />

      {/* Floating dot/cyber grid design overlays */}
      <div className="fixed inset-0 cyber-grid -z-20 pointer-events-none" />

      {/* Custom Cursor Ring */}
      {/* <div
        className="custom-cursor hidden md:block"
        style={{
          left: `${cursorPos.x}px`,
          top: `${cursorPos.y}px`,
          transform: `translate(-50%, -50%) scale(${cursorHover ? 1.5 : 1})`,
          borderColor: cursorHover ? "#2563eb" : "rgba(37, 99, 235, 0.4)",
          backgroundColor: cursorHover
            ? "rgba(37, 99, 235, 0.05)"
            : "transparent",
        }}
      /> */}
      <SplashCursor />

      {/* --- Premium Navigation Header --- */}
      <header className="fixed top-4 inset-x-4 h-16 z-50 glass-panel flex items-center justify-between px-6 md:px-10 border border-white/40 shadow-sm max-w-7xl mx-auto rounded-2xl">
        {/* Brand Logo */}
        <div
          onClick={() => scrollToSection("hero")}
          className="flex items-center gap-2.5 cursor-pointer font-black text-xl tracking-tight text-slate-800 hover:opacity-80 duration-300"
        >
          <span className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white text-base shadow-sm shadow-blue-500/30">
            P
          </span>
          <span className="font-extrabold text-lg select-none">
            Parth Patel
          </span>
        </div>

        {/* Desktop Menu links */}
        <nav className="hidden lg:flex items-center gap-6">
          {[
            { id: "hero", name: "Home" },
            { id: "about", name: "About" },
            { id: "skills", name: "Skills" },
            { id: "projects", name: "Projects" },
            { id: "timeline", name: "Timeline" },
            { id: "services", name: "Services" },
            // { id: "testimonials", name: "Feedback" },
          ].map((sec) => (
            <button
              key={sec.id}
              onClick={() => scrollToSection(sec.id)}
              className={`text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                activeSection === sec.id
                  ? "text-blue-600 scale-105"
                  : "text-slate-500 hover:text-blue-600"
              }`}
            >
              {sec.name}
            </button>
          ))}
        </nav>

        {/* CTA Contact Button */}
        <div className="hidden lg:block">
          <button
            onClick={() => scrollToSection("contact")}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-600/20 active:scale-95 transition-all duration-300 hover:-translate-y-0.5"
          >
            Let's Talk
          </button>
        </div>

        {/* Mobile Toggle Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-xl bg-slate-100/60 hover:bg-slate-200/60 text-slate-600 transition-colors"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth="2.5"
          >
            {mobileMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </header>

      {/* Mobile Drawer Menu Panel */}
      <div
        className={`fixed inset-x-4 top-22 z-40 glass-panel p-6 shadow-lg rounded-2xl flex flex-col gap-4 border border-white/50 lg:hidden transition-all duration-400 ${
          mobileMenuOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-8 pointer-events-none"
        }`}
      >
        {[
          { id: "hero", name: "Home" },
          { id: "about", name: "About" },
          { id: "skills", name: "Skills" },
          { id: "projects", name: "Projects" },
          { id: "timeline", name: "Timeline" },
          { id: "services", name: "Services" },
          // { id: "testimonials", name: "Feedback" },
          { id: "contact", name: "Contact" },
        ].map((sec) => (
          <button
            key={sec.id}
            onClick={() => scrollToSection(sec.id)}
            className={`w-full py-2.5 text-left text-sm font-semibold capitalize transition-all rounded-lg px-4 ${
              activeSection === sec.id
                ? "bg-blue-50 text-blue-600"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            {sec.name}
          </button>
        ))}
      </div>

      {/* --- Website Main Layout --- */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 relative pt-24 z-10 flex flex-col gap-32">
        {/* ================= HERO SECTION ================= */}
        <section
          id="hero"
          className="min-h-[85vh] flex flex-col lg:flex-row items-center justify-between py-12 relative"
        >
          {/* Floating visual parallax elements */}
          <div
            className="hero-float-1 absolute top-[15%] right-[20%] w-14 h-14 rounded-2xl bg-white/40 border border-white/20 backdrop-blur-md shadow-sm hidden xl:flex items-center justify-center p-3 animate-bounce"
            style={{ animationDuration: "6s" }}
          >
            <span className="font-extrabold text-blue-600 text-sm font-mono">
              &lt;/&gt;
            </span>
          </div>
          <div className="hero-float-2 absolute bottom-[20%] left-[40%] w-12 h-12 rounded-xl bg-white/40 border border-white/20 backdrop-blur-md shadow-sm hidden xl:flex items-center justify-center p-3 animate-pulse">
            <span className="text-xl font-bold text-sky-500 font-sans">
              &#123;&#125;
            </span>
          </div>

          {/* Left Text details */}
          <div className="w-full lg:w-[55%] flex flex-col items-start gap-6 z-10">
            {/* <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full glass-panel border border-white/50 text-xs font-bold text-blue-600 tracking-wider shadow-xxs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              AVAILABLE FOR NEW ROLES
            </div> */}

            <div className="flex flex-col gap-2">
              <span className="text-lg md:text-xl font-bold text-slate-500 tracking-wide uppercase">
                Hello, I'm
              </span>
              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 leading-tight">
                Parth Patel
              </h1>
              <h2 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-blue-600 via-sky-500 to-indigo-600 leading-tight">
                Full Stack Developer
              </h2>
            </div>

            <p className="text-slate-600 text-base md:text-lg leading-relaxed max-w-xl">
              I design and develop scalable, interactive, and high-performance
              digital products with premium user experiences. Specialized in
              crafting robust backends and cinematic frontends.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mt-4">
              <button
                onClick={() => scrollToSection("projects")}
                className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm tracking-wide shadow-md shadow-blue-500/20 hover:-translate-y-0.5 active:scale-95 transition-all duration-300"
              >
                View Projects
              </button>
              <button
                onClick={() => scrollToSection("contact")}
                className="w-full sm:w-auto px-7 py-3.5 rounded-2xl glass-panel text-slate-700 hover:text-blue-600 hover:bg-slate-50/50 font-bold text-sm tracking-wide shadow-sm hover:-translate-y-0.5 active:scale-95 transition-all duration-300"
              >
                Contact Me
              </button>
            </div>
          </div>

          {/* Right Floating Environment Badges */}
          <div className="w-full lg:w-[40%] flex justify-center items-center mt-12 lg:mt-0 relative h-100">
            {/* Ambient circular frame overlay representing Parth's 3D entity space */}
            <div
              className="absolute w-150 h-150 rounded-full border border-blue-200/30 bg-blue-500/1 flex items-center justify-center animate-spin"
              style={{ animationDuration: "40s" }}
            >
              <div className="absolute top-0 p-2.5 rounded-xl glass-panel text-xxs font-bold text-slate-600 shadow-xxs">
                React
              </div>
              <div className="absolute right-0 p-2.5 rounded-xl glass-panel text-xxs font-bold text-slate-600 shadow-xxs">
                Node.js
              </div>
              <div className="absolute bottom-0 p-2.5 rounded-xl glass-panel text-xxs font-bold text-slate-600 shadow-xxs">
                TypeScript
              </div>
              <div className="absolute left-0 p-2.5 rounded-xl glass-panel text-xxs font-bold text-slate-600 shadow-xxs">
                JavaScript
              </div>
            </div>
            {/* Core glowing node in center mapping to the 3D entity background */}
            <img
              src="/me.jfif"
              alt="Parth Patel"
              className="relative w-100 h-100 object-fill rounded-full border border-white/40 shadow-2x"
            />
          </div>
        </section>

        {/* ================= ABOUT SECTION ================= */}
        <section id="about" className="py-12 flex flex-col gap-12">
          <div className="section-title text-center max-w-xl mx-auto flex flex-col gap-2">
            <span className="text-xs font-bold text-blue-600 tracking-wider uppercase">
              01 / DISCOVER
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-slate-800 tracking-tight">
              About Me
            </h2>
            <div className="w-12 h-1.5 bg-blue-600 rounded-full mx-auto mt-2" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left side 3D details (shows morphing workspace grid background) */}
            <div className="glass-panel p-8 flex flex-col gap-6 max-w-xl mx-auto">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Digital Consciousness
              </span>
              <h3 className="text-2xl font-black text-slate-800 tracking-tight leading-snug">
                Engineering scalability with advanced interaction systems.
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                As a passionate Full Stack Architect, I build interactive web
                platforms that merge extreme backend engineering with cinematic
                visuals. I leverage cloud containers, database orchestrations,
                and performant animators to deliver web applications that leave
                a lasting mark.
              </p>
              <div className="w-full h-px bg-slate-200" />
              <div className="flex gap-4">
                <div>
                  <span className="text-xs text-slate-400 font-bold block uppercase tracking-wide">
                    LOCATION
                  </span>
                  <span className="text-sm font-bold text-slate-800">
                    Surat, Gujarat, India
                  </span>
                </div>
                <div className="w-px h-8 bg-slate-200" />
                <div>
                  <span className="text-xs text-slate-400 font-bold block uppercase tracking-wide">
                    SPECIALTY
                  </span>
                  <span className="text-sm font-bold text-slate-800">
                    Full Stack Systems
                  </span>
                </div>
              </div>
            </div>

            {/* Right side stats grid cards */}
            <div className="grid grid-cols-2 gap-4">
              <StatsCard
                targetValue={11}
                suffix="+"
                label="Months Experience"
                icon={<IconCalendar />}
              />
              <StatsCard
                targetValue={15}
                suffix="+"
                label="Projects Built"
                icon={<IconFolder />}
              />
              <StatsCard
                targetValue={10}
                suffix="+"
                label="Happy Clients"
                icon={<IconUsers />}
              />
              <StatsCard
                targetValue={1000}
                suffix="+"
                label="Hours Coded"
                icon={<IconCode />}
              />
            </div>
          </div>
        </section>

        {/* ================= SKILLS SECTION ================= */}
        <section id="skills" className="py-12 flex flex-col gap-12">
          <div className="section-title text-center max-w-xl mx-auto flex flex-col gap-2">
            <span className="text-xs font-bold text-blue-600 tracking-wider uppercase">
              02 / COMPETENCIES
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-slate-800 tracking-tight">
              Core Expertise
            </h2>
            <div className="w-12 h-1.5 bg-blue-600 rounded-full mx-auto mt-2" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Skill sets sidebar detail panels */}
            <div className="lg:col-span-4 flex flex-col gap-4 order-2 lg:order-1">
              <div className="glass-panel p-5">
                <h3 className="text-base font-extrabold text-blue-600 mb-1 tracking-tight">
                  Frontend Engineering
                </h3>
                <p className="text-slate-500 text-xs leading-relaxed mb-2">
                  Architecting smooth visual interfaces with pixel perfection,
                  interactive widgets, and state management.
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {["React", "Tailwind", "TypeScript", "Redux", "GSAP"].map(
                    (s) => (
                      <span
                        key={s}
                        className="px-2 py-0.5 bg-slate-100 text-slate-700 text-xxs font-bold rounded-md"
                      >
                        {s}
                      </span>
                    ),
                  )}
                </div>
              </div>

              <div className="glass-panel p-5">
                <h3 className="text-base font-extrabold text-sky-500 mb-1 tracking-tight">
                  Backend & Scalability
                </h3>
                <p className="text-slate-500 text-xs leading-relaxed mb-2">
                  Developing lightweight server networks, optimized REST and
                  WebSockets engines, and relational mapping.
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    "Node.js",
                    "Express",
                    "MongoDB",
                    "PostgreSQL",
                    "Firebase",
                    "REST",
                    "Redis",
                  ].map((s) => (
                    <span
                      key={s}
                      className="px-2 py-0.5 bg-slate-100 text-slate-700 text-xxs font-bold rounded-md"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="glass-panel p-5">
                <h3 className="text-base font-extrabold text-indigo-500 mb-1 tracking-tight">
                  DevOps & Cloud Systems
                </h3>
                <p className="text-slate-500 text-xs leading-relaxed mb-2">
                  Ensuring constant web availability, rapid container packaging,
                  and production continuous integrations.
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {["Git", "Vercel", "AWS"].map((s) => (
                    <span
                      key={s}
                      className="px-2 py-0.5 bg-slate-100 text-slate-700 text-xxs font-bold rounded-md"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Orbit cloud sphere rendering */}
            <div className="lg:col-span-8 flex justify-center order-1 lg:order-2">
              <SkillsOrbit />
            </div>
          </div>
        </section>

        {/* ================= PROJECTS SHOWCASE ================= */}
        {/* <section id="projects" className="py-12 flex flex-col gap-12">
          <div className="section-title text-center max-w-xl mx-auto flex flex-col gap-2">
            <span className="text-xs font-bold text-blue-600 tracking-wider uppercase">
              03 / CREATIONS
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-slate-800 tracking-tight">
              Featured Projects
            </h2>
            <div className="w-12 h-1.5 bg-blue-600 rounded-full mx-auto mt-2" />
          </div>

          <div className="flex flex-col gap-24">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-6 flex flex-col gap-5 items-start">
                <span className="px-3 py-1 bg-blue-50 border border-blue-100 text-blue-600 text-xxs font-bold tracking-widest rounded-full uppercase shadow-xxs">
                  FINTECH ORCHESTRATION
                </span>
                <h3 className="text-3xl font-black text-slate-900 tracking-tight leading-tight hover:text-blue-600 duration-300">
                  EverSwap Exchange
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  A high-end cinematic liquidity pool aggregator optimized for
                  decentralized multi-chain swap paths. Integrates standard
                  market APIs, smart execution routings, and dynamic SVG
                  chartings.
                </p>
                <div className="flex flex-wrap gap-2">
                  {[
                    "React",
                    "Tailwind",
                    "Go",
                    "Redis",
                    "WebSockets",
                    "Chart.js",
                  ].map((t) => (
                    <span
                      key={t}
                      className="px-2.5 py-1 bg-slate-100 text-slate-600 text-xxs font-bold rounded-lg border border-slate-200/50"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-4 mt-2">
                  <a
                    href="https://everswap.com"
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 group"
                  >
                    Live Demo
                    <span className="group-hover:translate-x-1 duration-200">
                      →
                    </span>
                  </a>
                  <span className="text-slate-300">|</span>
                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-bold text-slate-500 hover:text-slate-700"
                  >
                    Github
                  </a>
                </div>
              </div>
              <div className="lg:col-span-6 flex justify-center items-center h-[320px] relative">
                <div className="absolute w-[240px] h-[240px] rounded-full bg-blue-600/5 blur-3xl" />
                <div className="w-[85%] h-[200px] glass-panel border border-slate-200/60 p-4 shadow-md rotate-[-4deg] hover:rotate-0 duration-500 relative flex flex-col justify-between group overflow-hidden">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <div className="flex gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                    </div>
                    <span className="text-xxs font-bold text-slate-400 font-mono">
                      everswap.com/trade
                    </span>
                  </div>
                  <div className="flex gap-2 items-center justify-between my-2">
                    <div className="w-[60%] flex flex-col gap-1.5">
                      <div className="w-full h-3 bg-blue-600/10 rounded-sm" />
                      <div className="w-[80%] h-3 bg-blue-600/10 rounded-sm" />
                      <div className="w-[90%] h-3 bg-blue-600/10 rounded-sm" />
                    </div>
                    <div
                      className="w-12 h-12 rounded-full border-4 border-dashed border-blue-500/20 flex items-center justify-center animate-spin"
                      style={{ animationDuration: "15s" }}
                    >
                      <span className="w-4 h-4 rounded-full bg-blue-600" />
                    </div>
                  </div>
                  <div className="h-6 w-full bg-slate-50 border border-slate-200/50 rounded-md flex items-center justify-center text-xxs font-black text-slate-500">
                    SWAP COMPLETED successfully
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-6 flex justify-center items-center h-[320px] relative order-2 lg:order-1">
                <div className="absolute w-[240px] h-[240px] rounded-full bg-sky-500/5 blur-3xl" />
                <div className="w-[85%] h-[200px] glass-panel border border-slate-200/60 p-4 shadow-md rotate-[4deg] hover:rotate-0 duration-500 relative flex flex-col justify-between group overflow-hidden">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <div className="flex gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                    </div>
                    <span className="text-xxs font-bold text-slate-400 font-mono">
                      devhub.parth.io
                    </span>
                  </div>
                  <div className="flex gap-4 items-center justify-between my-2">
                    <div className="w-full flex flex-col gap-2">
                      <div className="w-full h-8 bg-sky-500/10 border border-sky-400/20 rounded-md flex items-center justify-between px-3 text-xxs font-bold text-sky-600">
                        <span>CPU USAGE</span>
                        <span>14%</span>
                      </div>
                      <div className="w-full h-8 bg-indigo-500/10 border border-indigo-400/20 rounded-md flex items-center justify-between px-3 text-xxs font-bold text-indigo-600">
                        <span>RAM HEAP</span>
                        <span>512MB / 2GB</span>
                      </div>
                    </div>
                  </div>
                  <div className="h-5 w-full bg-emerald-50 text-emerald-700 text-[10px] font-black rounded-md flex items-center justify-center uppercase tracking-wider">
                    SYSTEM STATUS: OPTIMAL
                  </div>
                </div>
              </div>

              <div className="lg:col-span-6 flex flex-col gap-5 items-start order-1 lg:order-2">
                <span className="px-3 py-1 bg-sky-50 border border-sky-100 text-sky-600 text-xxs font-bold tracking-widest rounded-full uppercase shadow-xxs">
                  COLLABORATIVE HUD
                </span>
                <h3 className="text-3xl font-black text-slate-900 tracking-tight leading-tight hover:text-sky-500 duration-300">
                  DevHub Workspace
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Real-time visual administration command console designed for
                  massive dev orchestration. Integrates robust container stats
                  trackers, automated process clusters, and live WebSocket
                  diagnostic pipes.
                </p>
                <div className="flex flex-wrap gap-2">
                  {[
                    "React",
                    "Tailwind",
                    "Node.js",
                    "Express",
                    "PostgreSQL",
                    "Docker",
                  ].map((t) => (
                    <span
                      key={t}
                      className="px-2.5 py-1 bg-slate-100 text-slate-600 text-xxs font-bold rounded-lg border border-slate-200/50"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-4 mt-2">
                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1 group"
                  >
                    Live Demo
                    <span className="group-hover:translate-x-1 duration-200">
                      →
                    </span>
                  </a>
                  <span className="text-slate-300">|</span>
                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-bold text-slate-500 hover:text-slate-700"
                  >
                    Github
                  </a>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-6 flex flex-col gap-5 items-start">
                <span className="px-3 py-1 bg-indigo-50 border border-indigo-100 text-indigo-600 text-xxs font-bold tracking-widest rounded-full uppercase shadow-xxs">
                  3D BROWSER EDITOR
                </span>
                <h3 className="text-3xl font-black text-slate-900 tracking-tight leading-tight hover:text-indigo-600 duration-300">
                  Nexus Mesh Studio
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Web-based modeling sandbox environment built using custom
                  HTML5 canvas rendering logic and WebGL integrations. Supports
                  live collaborative mesh adjustments, lights mapping, and
                  assets packaging.
                </p>
                <div className="flex flex-wrap gap-2">
                  {[
                    "React",
                    "Tailwind",
                    "Three.js",
                    "Vite",
                    "Firebase",
                    "GLSL",
                  ].map((t) => (
                    <span
                      key={t}
                      className="px-2.5 py-1 bg-slate-100 text-slate-600 text-xxs font-bold rounded-lg border border-slate-200/50"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-4 mt-2">
                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 group"
                  >
                    Live Demo
                    <span className="group-hover:translate-x-1 duration-200">
                      →
                    </span>
                  </a>
                  <span className="text-slate-300">|</span>
                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-bold text-slate-500 hover:text-slate-700"
                  >
                    Github
                  </a>
                </div>
              </div>

              <div className="lg:col-span-6 flex justify-center items-center h-[320px] relative">
                <div className="absolute w-[240px] h-[240px] rounded-full bg-indigo-600/5 blur-3xl" />
                <div className="w-[85%] h-[200px] glass-panel border border-slate-200/60 p-4 shadow-md rotate-[-3deg] hover:rotate-0 duration-500 relative flex flex-col justify-between group overflow-hidden">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <div className="flex gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                    </div>
                    <span className="text-xxs font-bold text-slate-400 font-mono">
                      nexus.mesh.studio
                    </span>
                  </div>
                  <div className="flex items-center justify-center my-3 relative h-16 bg-slate-50/50 rounded-lg border border-dashed border-slate-200">
                    <div
                      className="w-8 h-8 border border-indigo-600/60 rotate-45 flex items-center justify-center animate-spin"
                      style={{ animationDuration: "8s" }}
                    >
                      <div className="w-4 h-4 border border-indigo-600/40" />
                    </div>
                  </div>
                  <div className="h-6 w-full flex items-center justify-between text-xxs font-black text-slate-500 px-1">
                    <span>POLYGONS: 12,450</span>
                    <span>FPS: 60</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section> */}
        <ProjectsSection />

        {/* ================= EXPERIENCE TIMELINE ================= */}
        <section id="timeline" className="py-12 flex flex-col gap-12">
          <div className="section-title text-center max-w-xl mx-auto flex flex-col gap-2">
            <span className="text-xs font-bold text-blue-600 tracking-wider uppercase">
              04 / HISTORY
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-slate-800 tracking-tight">
              Career Journey
            </h2>
            <div className="w-12 h-1.5 bg-blue-600 rounded-full mx-auto mt-2" />
          </div>

          <Timeline />
        </section>

        {/* ================= SERVICES SECTION ================= */}
        <section id="services" className="py-12 flex flex-col gap-12">
          <div className="section-title text-center max-w-xl mx-auto flex flex-col gap-2">
            <span className="text-xs font-bold text-blue-600 tracking-wider uppercase">
              05 / SERVICES
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-slate-800 tracking-tight">
              What I Offer
            </h2>
            <div className="w-12 h-1.5 bg-blue-600 rounded-full mx-auto mt-2" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Full Stack Development",
                desc: "End-to-end robust server architectures linked to scalable web platforms with perfect data flows and database mappings.",
                color: "group-hover:border-blue-500/40",
                glow: "group-hover:bg-blue-600/5",
              },
              {
                title: "Frontend Engineering",
                desc: "Highly detailed reactive layouts constructed using TypeScript, custom animation timelines, and smooth client rendering processes.",
                color: "group-hover:border-sky-500/40",
                glow: "group-hover:bg-sky-500/5",
              },
              {
                title: "Backend & APIs",
                desc: "Designing fast data APIs using Node/Express, high-performance database indexing, process cluster schedulers, and Socket pipes.",
                color: "group-hover:border-indigo-500/40",
                glow: "group-hover:bg-indigo-600/5",
              },
              {
                title: "Admin Panels & HUDs",
                desc: "Bespoke corporate management dashboards equipped with complete authentication panels, visual data canvas sheets, and audit tracers.",
                color: "group-hover:border-blue-500/40",
                glow: "group-hover:bg-blue-600/5",
              },
              {
                title: "SEO Optimization & Growth",
                desc: "Advanced SEO strategies to improve website rankings, increase organic traffic, optimize performance, enhance search visibility, and drive higher user engagement across search engines.",
                color: "group-hover:border-sky-500/40",
                glow: "group-hover:bg-sky-500/5",
              },
              {
                title: "Performance Tuning",
                desc: "Optimizing resource requests, compressing static assets, minifying server routines, and maximizing Google Lighthouse standards.",
                color: "group-hover:border-indigo-500/40",
                glow: "group-hover:bg-indigo-600/5",
              },
            ].map((serv, idx) => (
              <div
                key={idx}
                className={`glass-panel p-6 flex flex-col gap-4 relative overflow-hidden group hover:-translate-y-1.5 duration-300 ${serv.color}`}
              >
                <div
                  className={`absolute inset-0 -z-10 transition-colors duration-300 ${serv.glow}`}
                />
                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200/50 flex items-center justify-center text-slate-700 font-extrabold text-sm font-mono group-hover:scale-105 group-hover:bg-blue-600 group-hover:text-white duration-300 shadow-xxs">
                  0{idx + 1}
                </div>
                <h3 className="text-xl font-bold text-slate-800 tracking-tight group-hover:text-blue-600 duration-300">
                  {serv.title}
                </h3>
                <p className="text-slate-500 text-xs md:text-sm leading-relaxed">
                  {serv.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ================= TESTIMONIALS SECTION ================= */}
        {/* <section id="testimonials" className="py-12 flex flex-col gap-12">
          <div className="section-title text-center max-w-xl mx-auto flex flex-col gap-2">
            <span className="text-xs font-bold text-blue-600 tracking-wider uppercase">
              06 / VERDICTS
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-slate-800 tracking-tight">
              Client Feedback
            </h2>
            <div className="w-12 h-1.5 bg-blue-600 rounded-full mx-auto mt-2" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                text: "Parth transformed our decentralized platform. His attention to smooth scroll-guided camera animations and high-performance React integrations delivered an end product that blew our clients away.",
                author: "Alex Rivers",
                role: "Director of Tech, EverSwap",
              },
              {
                text: "An absolute master of full stack architectures. Parth built our entire diagnostic command HUD in record time, linking container processes to real-time sockets with absolute precision.",
                author: "Sarah Jenkins",
                role: "Lead Engineer, DevHub",
              },
              {
                text: "Working with Parth was an amazing experience. He took our rough ideas and transformed them into a breathtaking 3D WebGL editor experience. Super clean code and seamless deployment support.",
                author: "Marcus Vance",
                role: "Founder, Nexus Studio",
              },
            ].map((test, idx) => (
              <div
                key={idx}
                className="glass-panel p-6 flex flex-col justify-between gap-6 relative overflow-hidden group hover:-translate-y-1.5 duration-300"
              >
                <span className="absolute -top-6 -left-2 text-slate-100 font-serif text-[120px] leading-none pointer-events-none select-none">
                  “
                </span>
                <p className="text-slate-600 text-sm italic leading-relaxed relative z-10">
                  {test.text}
                </p>
                <div className="flex flex-col border-t border-slate-100 pt-4">
                  <span className="text-sm font-bold text-slate-800">
                    {test.author}
                  </span>
                  <span className="text-xxs font-bold text-slate-400 tracking-wider uppercase">
                    {test.role}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section> */}

        {/* ================= CONTACT SECTION ================= */}
        <section id="contact" className="py-12 flex flex-col gap-12 mb-16">
          <div className="section-title text-center max-w-xl mx-auto flex flex-col gap-2">
            <span className="text-xs font-bold text-blue-600 tracking-wider uppercase">
              06 / CONNECT
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-slate-800 tracking-tight">
              Let's Connect
            </h2>
            <div className="w-12 h-1.5 bg-blue-600 rounded-full mx-auto mt-2" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Left side details and links */}
            <div className="lg:col-span-5 flex flex-col justify-between gap-8 glass-panel p-8">
              <div className="flex flex-col gap-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Available Immediately
                </span>
                <h3 className="text-2xl font-black text-slate-800 tracking-tight leading-snug">
                  Let's craft something beautiful together.
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Have an innovative product concept, a corporate system
                  refactor, or an immersive WebGL visualization project you need
                  help with? Reach out! I respond within 24 hours.
                </p>
              </div>

              {/* Social connect tags list */}
              <div className="flex flex-col gap-3">
                <a
                  href="mailto:patelparth53871@gmail.com"
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50 text-slate-600 hover:text-blue-600 duration-300 border border-transparent hover:border-blue-100/50"
                >
                  <div className="p-2 bg-slate-100 rounded-lg text-inherit">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                  </div>
                  <span className="text-xs font-bold tracking-wide">
                    patelparth53871@gmail.com
                  </span>
                </a>

                <a
                  href="https://www.linkedin.com/in/patel-parth-862346260?utm_source=share_via&utm_content=profile&utm_medium=member_android"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50 text-slate-600 hover:text-blue-600 duration-300 border border-transparent hover:border-blue-100/50"
                >
                  <div className="p-2 bg-slate-100 rounded-lg text-inherit">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                      <rect x="2" y="9" width="4" height="12" />
                      <circle cx="4" cy="4" r="2" />
                    </svg>
                  </div>
                  <span className="text-xs font-bold tracking-wide">
                    linkedin.com/in/patel-parth
                  </span>
                </a>

                <a
                  href="https://github.com/PatelParth2506"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50 text-slate-600 hover:text-blue-600 duration-300 border border-transparent hover:border-blue-100/50"
                >
                  <div className="p-2 bg-slate-100 rounded-lg text-inherit">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                    </svg>
                  </div>
                  <span className="text-xs font-bold tracking-wide">
                    github.com/PatelParth2506
                  </span>
                </a>
              </div>
            </div>

            {/* Right side contact form panel */}
            <div className="lg:col-span-7 glass-panel p-8 relative overflow-hidden flex flex-col justify-center">
              <form
                onSubmit={handleContactSubmit}
                className="flex flex-col gap-5 relative z-10"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xxs font-bold text-slate-400 uppercase tracking-widest">
                      Name
                    </label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      className="px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-600 focus:ring-1 focus:ring-blue-600/50 bg-white/50 backdrop-blur-sm text-sm transition-all outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xxs font-bold text-slate-400 uppercase tracking-widest">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="john@email.com"
                      value={formEmail}
                      onChange={(e) => setFormEmail(e.target.value)}
                      className="px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-600 focus:ring-1 focus:ring-blue-600/50 bg-white/50 backdrop-blur-sm text-sm transition-all outline-none"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xxs font-bold text-slate-400 uppercase tracking-widest">
                    Your Message
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Tell me about your planned project..."
                    value={formMsg}
                    onChange={(e) => setFormMsg(e.target.value)}
                    className="px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-600 focus:ring-1 focus:ring-blue-600/50 bg-white/50 backdrop-blur-sm text-sm transition-all outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm tracking-wide shadow-md shadow-blue-500/20 active:scale-95 transition-all duration-300 mt-2"
                >
                  Send Message
                </button>

                {/* Validation Status message block */}
                {formStatus === "success" && (
                  <div className="p-3 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-xl text-xs font-semibold text-center mt-2 shadow-xxs">
                    Message sent successfully! Parth will respond within 24
                    hours.
                  </div>
                )}
                {formStatus === "error" && (
                  <div className="p-3 bg-rose-50 border border-rose-100 text-rose-700 rounded-xl text-xs font-semibold text-center mt-2 shadow-xxs">
                    Please fill out all fields before submitting.
                  </div>
                )}
              </form>
            </div>
          </div>
        </section>
      </main>

      {/* --- Footer bar details --- */}
      <footer className="w-full border-t border-slate-200/50 py-8 text-center text-xxs font-bold tracking-wider text-slate-400 uppercase relative z-10 bg-slate-50/50 backdrop-blur-md">
        © 2026 Parth Patel. Built as an interactive cinematic digital
        experience. All rights reserved.
      </footer>
    </div>
  );
}
