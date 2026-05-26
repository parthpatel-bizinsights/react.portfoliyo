const PROJECTS_DATA = [
  {
    title: "Ai Chatbot",
    category: "AI Learner PLATFORM",
    description:
      "AI personal trainer with text & voice chat; multi-role hierarchy (Superadmin → Monitor Manager) tracks user progress.",
    tech: ["React", "Node.js", "PostgreSQL", "AI/LLM"],
    theme: {
      light: "bg-blue-50 border-blue-100",
      text: "text-blue-600",
      hover: "hover:text-blue-600",
      glow: "bg-blue-600/5",
    },
    mockup: "ai-chat",
    liveLink: "https://development.biz-insights.com/chatbot/",
    githubLink: "https://github.com/developers-bizinsights/react.biz-chat-bot",
  },
  {
    title: "Counsellor India",
    category: "MENTAL HEALTHCARE",
    description:
      "Mental healthcare platform: adaptive questionnaires, AI-generated assessment reports, multi-role access, and Psypack integration.",
    tech: ["MERN", "PostgreSQL", "AI/LLM", "Psypack"],
    theme: {
      light: "bg-emerald-50 border-emerald-100",
      text: "text-emerald-600",
      hover: "hover:text-emerald-600",
      glow: "bg-emerald-600/5",
    },
    mockup: "report",
    liveLink: "https://counselorsindia.com/",
    githubLink: "https://github.com/endorphingitrender/react.counsellor-india",
  },
  {
    title: "Dreamcare HomeSoultion",
    category: "SERVICE MANAGEMENT",
    description:
      "Admin-side service management — categories, time slots, employee assignment, and full booking workflow monitoring.",
    tech: ["React", "Node.js", "MySQL", "Sequelize"],
    theme: {
      light: "bg-violet-50 border-violet-100",
      text: "text-violet-600",
      hover: "hover:text-violet-600",
      glow: "bg-violet-600/5",
    },
    mockup: "calendar",
    liveLink: "https://www.dreamcarehomesolutions.com/",
    githubLink:
      "https://github.com/developers-bizinsights/react.dreamcare-homesolutions",
  },
  {
    title: "Trademaker",
    category: "IP FILING PORTAL",
    description:
      "IP filing platform — user buys service, employee fills trademark form, status synced from government website in real time.",
    tech: ["React", "Node.js", "PostgreSQL", "Razorpay"],
    theme: {
      light: "bg-amber-50 border-amber-100",
      text: "text-amber-600",
      hover: "hover:text-amber-600",
      glow: "bg-amber-600/5",
    },
    mockup: "sync",
    // liveLink: "https://trademaker.example.com",
    githubLink: "https://github.com/developers-bizinsights/node.trademark",
  },
  {
    title: "Video & Chat App",
    category: "REAL-TIME COMMS",
    description:
      "Real-time group video calls and instant messaging utilizing direct peer-to-peer data streaming.",
    tech: ["React", "Socket.io", "WebRTC", "Node.js"],
    theme: {
      light: "bg-rose-50 border-rose-100",
      text: "text-rose-600",
      hover: "hover:text-rose-600",
      glow: "bg-rose-600/5",
    },
    mockup: "video",
    githubLink: "https://github.com/PatelParth2506/Chat-Application",
  },
  {
    title: "File Store & Share",
    category: "CLOUD STORAGE",
    description:
      "Secure cloud file storage with AWS S3 buckets, shareable link generation, folder organisation and role-based access.",
    tech: ["React", "Node.js", "MongoDB", "AWS S3"],
    theme: {
      light: "bg-sky-50 border-sky-100",
      text: "text-sky-600",
      hover: "hover:text-sky-600",
      glow: "bg-sky-600/5",
    },
    mockup: "cloud",
    githubLink: "https://github.com/PatelParth2506/File-Management",
  },
  {
    title: "Appointment Manager",
    category: "BOOKING SYSTEM",
    description:
      "Booking system with comprehensive calendar views, slot management, and automated WhatsApp/SMS/email notifications via queue workers.",
    tech: ["React", "Shadcn/UI", "Express.js", "BullMQ"],
    theme: {
      light: "bg-indigo-50 border-indigo-100",
      text: "text-indigo-600",
      hover: "hover:text-indigo-600",
      glow: "bg-indigo-600/5",
    },
    mockup: "queue",
    liveLink: "https://development.biz-insights.com/dental-clinic",
    githubLink: "https://github.com/developers-bizinsights/react.dental-clinic",
  },
  {
    title: "V Card Generator",
    category: "DIGITAL IDENTITY",
    description:
      "Digital business card generator featuring custom profile themes, dynamic QR code export, and customizable link-in-bio functionality.",
    tech: ["React", "Shadcn/UI", "Node.js"],
    theme: {
      light: "bg-fuchsia-50 border-fuchsia-100",
      text: "text-fuchsia-600",
      hover: "hover:text-fuchsia-600",
      glow: "bg-fuchsia-600/5",
    },
    mockup: "card",
    liveLink: "https://development.biz-insights.com/biz-connect/",
    githubLink: "https://github.com/developers-bizinsights/react.biz-connect",
  },
];

// Helper component to render dynamic visual mockups based on project type
const VisualMockup = ({ type }: { type: string }) => {
  switch (type) {
    case "ai-chat":
      return (
        <div className="flex flex-col gap-3 w-full mt-2">
          <div className="w-[70%] h-8 bg-blue-100 rounded-2xl rounded-tl-sm self-start animate-pulse" />
          <div className="w-[60%] h-12 bg-blue-600 text-white flex items-center justify-center rounded-2xl rounded-tr-sm self-end font-mono text-[10px]">
            Analyzing voice...
          </div>
          <div className="w-full h-8 flex items-center justify-center gap-1 mt-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className={`w-1.5 h-${i % 2 === 0 ? "6" : "3"} bg-blue-400 rounded-full animate-bounce`}
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
        </div>
      );
    case "report":
      return (
        <div className="flex flex-col gap-2 w-full h-full justify-center">
          <div className="w-full h-4 bg-emerald-100 rounded-sm" />
          <div className="flex gap-2 w-full">
            <div className="w-1/3 h-16 bg-emerald-50 border border-emerald-200 rounded-md flex items-center justify-center text-emerald-600 font-bold text-lg">
              A+
            </div>
            <div className="w-2/3 flex flex-col gap-1.5 justify-center">
              <div className="w-full h-2 bg-slate-100 rounded-full">
                <div className="w-[85%] h-full bg-emerald-400 rounded-full" />
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full">
                <div className="w-[60%] h-full bg-emerald-400 rounded-full" />
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full">
                <div className="w-[92%] h-full bg-emerald-400 rounded-full" />
              </div>
            </div>
          </div>
          <div className="w-full h-4 bg-emerald-100 rounded-sm mt-1" />
        </div>
      );
    case "calendar":
      return (
        <div className="grid grid-cols-4 gap-1 w-full mt-4">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className={`h-6 rounded-sm ${i === 4 || i === 7 ? "bg-violet-500" : "bg-violet-100"}`}
            />
          ))}
          <div className="col-span-4 h-6 mt-2 bg-violet-600 text-white text-[10px] flex items-center justify-center font-bold rounded-sm">
            SLOT ASSIGNED
          </div>
        </div>
      );
    case "sync":
      return (
        <div className="flex flex-col items-center justify-center h-full gap-4 w-full">
          <div className="flex justify-between items-center w-full px-4">
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center border-2 border-amber-400">
              👤
            </div>
            <div className="flex-1 h-0.5 bg-dashed border-t-2 border-dashed border-amber-200 relative">
              <div className="absolute w-3 h-3 bg-amber-500 rounded-full -top-1.5 left-1/2 animate-ping" />
            </div>
            <div className="w-10 h-10 rounded-md bg-amber-100 flex items-center justify-center border-2 border-amber-600 font-serif font-bold text-amber-700">
              GOV
            </div>
          </div>
          <div className="bg-amber-50 text-amber-600 text-[10px] font-bold px-3 py-1 rounded-full uppercase">
            Live Status: Approved
          </div>
        </div>
      );
    case "video":
      return (
        <div className="grid grid-cols-2 gap-2 w-full h-full mt-2">
          <div className="bg-rose-200 rounded-lg relative overflow-hidden flex items-center justify-center">
            <div className="w-8 h-8 bg-rose-400 rounded-full animate-pulse" />
            <div className="absolute bottom-1 left-1 bg-black/40 text-white text-[8px] px-1 rounded">
              Host
            </div>
          </div>
          <div className="bg-rose-100 rounded-lg flex items-center justify-center">
            👤
          </div>
          <div className="bg-rose-100 rounded-lg flex items-center justify-center">
            👤
          </div>
          <div className="bg-rose-100 rounded-lg flex items-center justify-center">
            👤
          </div>
        </div>
      );
    case "cloud":
      return (
        <div className="flex flex-col items-center justify-center h-full w-full gap-3">
          <div className="w-16 h-12 bg-sky-200 rounded-lg relative flex items-center justify-center">
            <div className="absolute -top-2 left-2 w-6 h-4 bg-sky-200 rounded-t-sm" />
            <span className="text-sky-600 font-bold text-xs z-10">AWS S3</span>
          </div>
          <div className="flex gap-2">
            <div className="w-16 h-2 bg-sky-100 rounded-full overflow-hidden">
              <div
                className="w-full h-full bg-sky-500 rounded-full animate-[slide_2s_ease-in-out_infinite]"
                style={{ transformOrigin: "left" }}
              />
            </div>
          </div>
        </div>
      );
    case "queue":
      return (
        <div className="flex flex-col gap-2 w-full h-full justify-center px-4">
          <div className="w-full h-8 bg-indigo-100 rounded-md flex items-center justify-between px-2 opacity-50">
            <span className="w-4 h-4 bg-indigo-300 rounded-full" />
            <div className="w-1/2 h-2 bg-indigo-200 rounded-full" />
          </div>
          <div className="w-full h-8 bg-indigo-500 text-white rounded-md flex items-center justify-between px-2 shadow-md translate-x-2">
            <span className="text-[10px] font-bold">BullMQ Processing</span>
            <span className="animate-spin text-xs">⚙️</span>
          </div>
          <div className="w-full h-8 bg-indigo-100 rounded-md flex items-center justify-between px-2 opacity-50">
            <span className="w-4 h-4 bg-indigo-300 rounded-full" />
            <div className="w-1/2 h-2 bg-indigo-200 rounded-full" />
          </div>
        </div>
      );
    case "card":
      return (
        <div className="flex items-center justify-center h-full w-full">
          <div className="w-30 h-40 bg-linear-to-br from-fuchsia-100 to-fuchsia-300 rounded-xl shadow-lg border border-white flex flex-col items-center p-3 gap-2 rotate-[-5deg] hover:rotate-0 duration-300">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-lg">
              👩‍💼
            </div>
            <div className="w-[80%] h-2 bg-white/60 rounded-full" />
            <div className="w-[60%] h-2 bg-white/60 rounded-full" />
            <div className="mt-auto w-12 h-12 bg-white p-1 rounded shadow-sm border border-fuchsia-200 grid grid-cols-2 gap-0.5">
              <div className="bg-fuchsia-900 rounded-sm" />
              <div className="bg-fuchsia-900 rounded-sm" />
              <div className="bg-fuchsia-900 rounded-sm" />
              <div className="bg-fuchsia-900 rounded-sm" />
            </div>
          </div>
        </div>
      );
    default:
      return null;
  }
};

export const ProjectsSection = () => {
  return (
    <section
      id="projects"
      className="py-12 flex flex-col gap-12 overflow-hidden"
    >
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
        {PROJECTS_DATA.map((project, idx) => {
          const isEven = idx % 2 === 0;

          return (
            <div
              key={idx}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center px-4 md:px-8"
            >
              {/* Text Content */}
              <div
                className={`lg:col-span-6 flex flex-col gap-5 items-start ${
                  isEven ? "order-2 lg:order-1" : "order-2 lg:order-2"
                }`}
              >
                <span
                  className={`px-3 py-1 border text-xxs font-bold tracking-widest rounded-full uppercase shadow-xxs ${project.theme.light} ${project.theme.text}`}
                >
                  {project.category}
                </span>
                <h3
                  className={`text-3xl font-black text-slate-900 tracking-tight leading-tight duration-300 ${project.theme.hover}`}
                >
                  {project.title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.tech.map((t) => (
                    <span
                      key={t}
                      className="px-2.5 py-1 bg-slate-100 text-slate-600 text-xxs font-bold rounded-lg border border-slate-200/50"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                {/* CONDITIONAL LINKS SECTION */}
                <div className="flex items-center gap-4 mt-2">
                  {project.liveLink && (
                    <>
                      <a
                        href={project.liveLink}
                        target="_blank"
                        rel="noreferrer"
                        className={`text-xs font-bold flex items-center gap-1 group ${project.theme.text}`}
                      >
                        Live Demo
                        <span className="group-hover:translate-x-1 duration-200">
                          →
                        </span>
                      </a>
                      {project.githubLink && (
                        <span className="text-slate-300">|</span>
                      )}
                    </>
                  )}
                  {project.githubLink && (
                    <a
                      href={project.githubLink}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-bold text-slate-500 hover:text-slate-700"
                    >
                      Github
                    </a>
                  )}
                </div>
              </div>

              {/* Visual Device Mockup */}
              <div
                className={`lg:col-span-6 flex justify-center items-center h-80 relative ${
                  isEven ? "order-1 lg:order-2" : "order-1 lg:order-1"
                }`}
              >
                {/* Background active glow ring */}
                <div
                  className={`absolute w-60 h-60 rounded-full blur-3xl ${project.theme.glow}`}
                />

                {/* Base Device structure */}
                <div
                  className={`w-[85%] h-50 bg-white/40 backdrop-blur-md border border-slate-200/60 p-4 shadow-md duration-500 relative flex flex-col group overflow-hidden ${
                    isEven
                      ? "-rotate-3 hover:rotate-0"
                      : "rotate-3 hover:rotate-0"
                  }`}
                >
                  {/* Fake Browser/App Header */}
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
                    <div className="flex gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                    </div>
                    <span className="text-xxs font-bold text-slate-400 font-mono lowercase">
                      {project.title.replace(/\s+/g, "")}.app
                    </span>
                  </div>

                  {/* Dynamic Project Visualization */}
                  <div className="flex-1 flex flex-col overflow-hidden relative">
                    <VisualMockup type={project.mockup} />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
