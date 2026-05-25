import React, { useEffect, useRef, useState } from 'react';

interface SkillTag {
  text: string;
  category: 'frontend' | 'backend' | 'devops';
  x: number;
  y: number;
  z: number;
}

const SKILL_ITEMS: { text: string; category: 'frontend' | 'backend' | 'devops' }[] = [
  // Frontend
  { text: 'React', category: 'frontend' },
  { text: 'Next.js', category: 'frontend' },
  { text: 'Tailwind CSS', category: 'frontend' },
  { text: 'TypeScript', category: 'frontend' },
  { text: 'Redux', category: 'frontend' },
  { text: 'Framer Motion', category: 'frontend' },
  { text: 'GSAP', category: 'frontend' },
  { text: 'Three.js', category: 'frontend' },

  // Backend
  { text: 'Node.js', category: 'backend' },
  { text: 'Express', category: 'backend' },
  { text: 'MongoDB', category: 'backend' },
  { text: 'PostgreSQL', category: 'backend' },
  { text: 'Firebase', category: 'backend' },
  { text: 'REST APIs', category: 'backend' },
  { text: 'GraphQL', category: 'backend' },

  // DevOps
  { text: 'Git', category: 'devops' },
  { text: 'Docker', category: 'devops' },
  { text: 'Vercel', category: 'devops' },
  { text: 'AWS', category: 'devops' },
  { text: 'Linux', category: 'devops' },
];

export const SkillsOrbit: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeCategory, setActiveCategory] = useState<'all' | 'frontend' | 'backend' | 'devops'>('all');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
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

      tags.push({
        text: item.text,
        category: item.category,
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

    // Hover detection state
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

        // Influence rotation speeds based on drag distance
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

    canvas.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('touchstart', handleTouchStart);
    canvas.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleMouseUp);

    // --- Projection and Animation ---
    let animFrameId: number;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Sphere rotation operations
      const cosX = Math.cos(angleX);
      const sinX = Math.sin(angleX);
      const cosY = Math.cos(angleY);
      const sinY = Math.sin(angleY);

      tags.forEach((tag) => {
        // Rotate Y axis
        const x1 = tag.x * cosY - tag.z * sinY;
        const z1 = tag.z * cosY + tag.x * sinY;

        // Rotate X axis
        const y2 = tag.y * cosX - z1 * sinX;
        const z2 = z1 * cosX + tag.y * sinX;

        tag.x = x1;
        tag.y = y2;
        tag.z = z2;
      });

      // Gradually slow down to ambient auto-spin speed
      if (!isDragging) {
        angleX += (0.002 - angleX) * 0.05;
        angleY += (0.002 - angleY) * 0.05;
      }

      // Sort tags by depth (z) to render back elements before front elements
      const sortedTags = [...tags].sort((a, b) => b.z - a.z);

      const centerX = width / 2;
      const centerY = height / 2;
      const fov = width * 0.8; // Perspective factor

      hoveredIndex = null;

      sortedTags.forEach((tag, idx) => {
        // Active category filter: fade other tags drastically
        const isSelectedCategory = activeCategory === 'all' || tag.category === activeCategory;
        const categoryOpacityScale = isSelectedCategory ? 1.0 : 0.15;

        // Perspective scaling
        const scale = fov / (fov + tag.z);
        const screenX = centerX + tag.x * scale;
        const screenY = centerY + tag.y * scale;

        // Calculate opacity based on Z coordinate (depth)
        const alpha = ((tag.z + radius) / (2 * radius)) * 0.65 + 0.35;
        const fontSize = Math.max(10, Math.min(22, 14 * scale));

        ctx.font = `600 ${fontSize}px Figtree Variable, sans-serif`;
        const textWidth = ctx.measureText(tag.text).width;
        const paddingX = 12 * scale;
        const paddingY = 6 * scale;
        const textHeight = fontSize;

        const boxWidth = textWidth + paddingX * 2;
        const boxHeight = textHeight + paddingY * 2;

        // Bounds check for hover detection (only allow hovering front items)
        if (
          tag.z < radius * 0.5 && // restricts hover to the front half of the sphere
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

        // Render card backing (Glassmorphism design style)
        ctx.save();
        ctx.translate(screenX, screenY);

        // Hover scale factor
        const hoverScale = isHovered ? 1.15 : 1.0;
        ctx.scale(hoverScale, hoverScale);

        // Subtle gradient background based on skill category
        let gradientColor = 'rgba(37, 99, 235, 0.08)'; // Blue
        let borderColor = 'rgba(37, 99, 235, 0.2)';
        let textColor = 'rgba(15, 23, 42, 0.85)';

        if (tag.category === 'backend') {
          gradientColor = 'rgba(14, 165, 233, 0.08)'; // Sky
          borderColor = 'rgba(14, 165, 233, 0.2)';
        } else if (tag.category === 'devops') {
          gradientColor = 'rgba(79, 70, 229, 0.08)'; // Indigo
          borderColor = 'rgba(79, 70, 229, 0.2)';
        }

        if (isHovered) {
          gradientColor = tag.category === 'frontend' 
            ? 'rgba(37, 99, 235, 0.95)' 
            : tag.category === 'backend' 
            ? 'rgba(14, 165, 233, 0.95)' 
            : 'rgba(79, 70, 229, 0.95)';
          borderColor = gradientColor;
          textColor = '#FFFFFF';
        }

        // Draw pill card background
        ctx.beginPath();
        const rx = -boxWidth / 2;
        const ry = -boxHeight / 2;
        const rw = boxWidth;
        const rh = boxHeight;
        const rRad = 8 * scale;
        
        ctx.roundRect ? ctx.roundRect(rx, ry, rw, rh, rRad) : ctx.rect(rx, ry, rw, rh);
        
        ctx.fillStyle = gradientColor;
        ctx.globalAlpha = alpha * categoryOpacityScale;
        ctx.fill();

        ctx.strokeStyle = borderColor;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Render text label inside card
        ctx.fillStyle = textColor;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(tag.text, 0, 0);

        ctx.restore();
      });

      // Slow down rotation even more if hovering an item
      if (hoveredIndex !== null) {
        angleX *= 0.85;
        angleY *= 0.85;
      }

      animFrameId = requestAnimationFrame(render);
    };

    render();

    // Handle Resize
    const handleResize = () => {
      if (!containerRef.current) return;
      width = containerRef.current.clientWidth;
      height = width;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animFrameId);
      canvas.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
      window.removeEventListener('resize', handleResize);
    };
  }, [activeCategory]);

  return (
    <div className="flex flex-col items-center w-full" ref={containerRef}>
      {/* Category selection bar */}
      <div className="flex gap-2 p-1.5 mb-6 glass-panel rounded-full text-xs md:text-sm shadow-sm z-10">
        {(['all', 'frontend', 'backend', 'devops'] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-1.5 rounded-full capitalize font-semibold transition-all duration-300 ${
              activeCategory === cat
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="relative w-full cursor-grab active:cursor-grabbing flex justify-center items-center">
        <canvas ref={canvasRef} className="max-w-full" />
        {/* Help label overlay */}
        <div className="absolute bottom-2 text-center pointer-events-none text-slate-400 text-xxs tracking-wider uppercase opacity-60">
          Drag to spin • Hover tags
        </div>
      </div>
    </div>
  );
};
