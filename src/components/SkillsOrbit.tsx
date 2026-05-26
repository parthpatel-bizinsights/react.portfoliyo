import React, { useEffect, useRef, useState } from "react";

interface SkillTag {
  text: string;
  category: "frontend" | "backend" | "devops";
  iconUrl?: string;
  img?: HTMLImageElement; // Storing the loaded image for canvas rendering
  x: number;
  y: number;
  z: number;
}

const SKILL_ITEMS: {
  text: string;
  category: "frontend" | "backend" | "devops";
  iconUrl?: string;
}[] = [
  // Frontend
  {
    text: "React",
    category: "frontend",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg",
  },
  {
    text: "Tailwind",
    category: "frontend",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg",
  },
  {
    text: "TypeScript",
    category: "frontend",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg",
  },
  {
    text: "Redux",
    category: "frontend",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/redux/redux-original.svg",
  },
  {
    text: "Framer Motion",
    category: "frontend",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/framermotion/framermotion-original.svg",
  },
  {
    text: "Electron.js",
    category: "frontend",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/electron/electron-original.svg",
  },
  {
    text: "Shadcn UI",
    category: "frontend",
  },
  {
    text: "Nx",
    category: "frontend",
  },

  // Backend
  {
    text: "Node.js",
    category: "backend",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg",
  },
  {
    text: "Express",
    category: "backend",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/express/express-original.svg",
  },
  {
    text: "MongoDB",
    category: "backend",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mongodb/mongodb-original.svg",
  },
  {
    text: "PostgreSQL",
    category: "backend",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg",
  },
  {
    text: "Firebase",
    category: "backend",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/firebase/firebase-original.svg",
  },
  {
    text: "Socket.io",
    category: "backend",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/socketio/socketio-original.svg",
  },
  {
    text: "Sequelize",
    category: "backend",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/sequelize/sequelize-original.svg",
  },
  {
    text: "BullMQ",
    category: "backend",
  },

  // DevOps
  {
    text: "Git",
    category: "devops",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg",
  },
  {
    text: "Vercel",
    category: "devops",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vercel/vercel-original.svg",
  },
  {
    text: "AWS",
    category: "devops",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-original-wordmark.svg",
  },
  {
    text: "Nginx",
    category: "devops",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nginx/nginx-original.svg",
  },
];
export const SkillsOrbit: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeCategory, setActiveCategory] = useState<
    "all" | "frontend" | "backend" | "devops"
  >("all");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = containerRef.current?.clientWidth || 500;
    let height = width; // Keep square ratio
    canvas.width = width;
    canvas.height = height;

    const tags: SkillTag[] = [];
    const count = SKILL_ITEMS.length;
    const radius = width * 0.38;

    // Distribute skills evenly on a 3D Sphere shell using Fibonacci spiral
    SKILL_ITEMS.forEach((item, idx) => {
      const theta = Math.acos(-1 + (2 * idx) / count);
      const phi = Math.sqrt(count * Math.PI) * theta;

      // Pre-load images for the canvas
      let imgObj: HTMLImageElement | undefined = undefined;
      if (item.iconUrl) {
        imgObj = new Image();
        imgObj.src = item.iconUrl;
      }

      tags.push({
        text: item.text,
        category: item.category,
        iconUrl: item.iconUrl,
        img: imgObj,
        x: radius * Math.sin(theta) * Math.cos(phi),
        y: radius * Math.sin(theta) * Math.sin(phi),
        z: radius * Math.cos(theta),
      });
    });

    let angleX = 0.005; // auto-spin velocity
    let angleY = 0.005;
    let isDragging = false;
    let startX = 0;
    let startY = 0;

    let hoveredIndex: number | null = null;
    let mouseX = 0;
    let mouseY = 0;

    // --- Drag Interaction physics ---
    const handleMouseDown = (e: MouseEvent) => {
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;

      if (isDragging) {
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;

        angleY = dx * 0.00015;
        angleX = -dy * 0.00015;

        startX = e.clientX;
        startY = e.clientY;
      }
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    // Touch Support
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDragging = true;
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isDragging && e.touches.length === 1) {
        const dx = e.touches[0].clientX - startX;
        const dy = e.touches[0].clientY - startY;

        angleY = dx * 0.0003;
        angleX = -dy * 0.0003;

        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
      }
    };

    canvas.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    canvas.addEventListener("touchstart", handleTouchStart);
    canvas.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchend", handleMouseUp);

    // --- Projection and Animation ---
    let animFrameId: number;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const cosX = Math.cos(angleX);
      const sinX = Math.sin(angleX);
      const cosY = Math.cos(angleY);
      const sinY = Math.sin(angleY);

      tags.forEach((tag) => {
        const x1 = tag.x * cosY - tag.z * sinY;
        const z1 = tag.z * cosY + tag.x * sinY;
        const y2 = tag.y * cosX - z1 * sinX;
        const z2 = z1 * cosX + tag.y * sinX;

        tag.x = x1;
        tag.y = y2;
        tag.z = z2;
      });

      if (!isDragging) {
        angleX += (0.002 - angleX) * 0.05;
        angleY += (0.002 - angleY) * 0.05;
      }

      const sortedTags = [...tags].sort((a, b) => b.z - a.z);

      const centerX = width / 2;
      const centerY = height / 2;
      const fov = width * 0.8;

      hoveredIndex = null;

      sortedTags.forEach((tag, idx) => {
        const isSelectedCategory =
          activeCategory === "all" || tag.category === activeCategory;
        const categoryOpacityScale = isSelectedCategory ? 1.0 : 0.15;

        const scale = fov / (fov + tag.z);
        const screenX = centerX + tag.x * scale;
        const screenY = centerY + tag.y * scale;

        const alpha = ((tag.z + radius) / (2 * radius)) * 0.65 + 0.35;

        // --- Calculate Layout & Spacing ---
        const fontSize = Math.max(10, Math.min(22, 14 * scale));
        const iconSize = fontSize * 1.3; // Make icon slightly larger than text
        const gap = 8 * scale; // Space between icon and text

        ctx.font = `600 ${fontSize}px Figtree Variable, sans-serif`;
        const textWidth = ctx.measureText(tag.text).width;
        const hasIcon = tag.img && tag.img.complete;

        // Total width of the content inside the pill
        const contentWidth = (hasIcon ? iconSize + gap : 0) + textWidth;
        const paddingX = 14 * scale;
        const paddingY = 8 * scale;

        const boxWidth = contentWidth + paddingX * 2;
        const boxHeight = Math.max(fontSize, iconSize) + paddingY * 2;

        if (
          tag.z < radius * 0.5 &&
          mouseX >= screenX - boxWidth / 2 &&
          mouseX <= screenX + boxWidth / 2 &&
          mouseY >= screenY - boxHeight / 2 &&
          mouseY <= screenY + boxHeight / 2 &&
          isSelectedCategory &&
          !isDragging
        ) {
          hoveredIndex = idx;
        }

        const isHovered = hoveredIndex === idx;

        ctx.save();
        ctx.translate(screenX, screenY);

        const hoverScale = isHovered ? 1.15 : 1.0;
        ctx.scale(hoverScale, hoverScale);

        // Colors
        let gradientColor = "rgba(37, 99, 235, 0.08)";
        let borderColor = "rgba(37, 99, 235, 0.2)";
        let textColor = "rgba(15, 23, 42, 0.85)";

        if (tag.category === "backend") {
          gradientColor = "rgba(14, 165, 233, 0.08)";
          borderColor = "rgba(14, 165, 233, 0.2)";
        } else if (tag.category === "devops") {
          gradientColor = "rgba(79, 70, 229, 0.08)";
          borderColor = "rgba(79, 70, 229, 0.2)";
        }

        if (isHovered) {
          gradientColor =
            tag.category === "frontend"
              ? "rgba(37, 99, 235, 0.95)"
              : tag.category === "backend"
                ? "rgba(14, 165, 233, 0.95)"
                : "rgba(79, 70, 229, 0.95)";
          borderColor = gradientColor;
          textColor = "#FFFFFF";
        }

        // Draw Pill
        ctx.beginPath();
        const rx = -boxWidth / 2;
        const ry = -boxHeight / 2;
        const rRad = 10 * scale;

        ctx.roundRect
          ? ctx.roundRect(rx, ry, boxWidth, boxHeight, rRad)
          : ctx.rect(rx, ry, boxWidth, boxHeight);

        ctx.fillStyle = gradientColor;
        ctx.globalAlpha = alpha * categoryOpacityScale;
        ctx.fill();

        ctx.strokeStyle = borderColor;
        ctx.lineWidth = 1;
        ctx.stroke();

        // --- Render Icon and Text ---
        ctx.globalAlpha = alpha * categoryOpacityScale; // reset alpha for text/icon
        let startX = -contentWidth / 2; // Start drawing from the left edge of the content area

        // Draw Image if available
        if (hasIcon && tag.img) {
          ctx.drawImage(tag.img, startX, -iconSize / 2, iconSize, iconSize);
          startX += iconSize + gap; // Shift starting X for the text
        }

        // Draw Text
        ctx.fillStyle = textColor;
        ctx.textAlign = "left"; // Changed to left so it aligns next to the icon
        ctx.textBaseline = "middle";
        ctx.fillText(tag.text, startX, 0);

        ctx.restore();
      });

      if (hoveredIndex !== null) {
        angleX *= 0.85;
        angleY *= 0.85;
      }

      animFrameId = requestAnimationFrame(render);
    };

    render();

    const handleResize = () => {
      if (!containerRef.current) return;
      width = containerRef.current.clientWidth;
      height = width;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animFrameId);
      canvas.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      canvas.removeEventListener("touchstart", handleTouchStart);
      canvas.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleMouseUp);
      window.removeEventListener("resize", handleResize);
    };
  }, [activeCategory]);

  return (
    <div className="flex flex-col items-center w-full" ref={containerRef}>
      <div className="flex gap-2 p-1.5 mb-6 glass-panel rounded-full text-xs md:text-sm shadow-sm z-10">
        {(["all", "frontend", "backend", "devops"] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-1.5 rounded-full capitalize font-semibold transition-all duration-300 ${
              activeCategory === cat
                ? "bg-blue-600 text-white shadow-md"
                : "text-slate-600 hover:text-blue-600 hover:bg-slate-50"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="relative w-full cursor-grab active:cursor-grabbing flex justify-center items-center">
        <canvas ref={canvasRef} className="max-w-full" />
        <div className="absolute bottom-2 text-center pointer-events-none text-slate-400 text-[10px] tracking-wider uppercase opacity-60">
          Drag to spin • Hover tags
        </div>
      </div>
    </div>
  );
};
