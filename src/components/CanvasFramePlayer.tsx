import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const TOTAL_FRAMES = 240;

export const CanvasFramePlayer: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Store loaded image objects in a persistent ref
  const preloadedImages = useRef<HTMLImageElement[]>([]);
  const playheadRef = useRef({ frame: 0 });

  // Setup everything in a single, robust useEffect on mount
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    // --- 1. Preload Images in Parallel ---
    let loadedCount = 0;
    const imagesList: HTMLImageElement[] = [];

    for (let idx = 0; idx < TOTAL_FRAMES; idx++) {
      const img = new Image();
      const frameStr = String(idx + 1).padStart(3, '0');
      img.src = `/sequences/hero/ezgif-frame-${frameStr}.jpg`;

      img.onload = () => {
        loadedCount++;
        const progress = Math.floor((loadedCount / TOTAL_FRAMES) * 100);
        setLoadingProgress(progress);
        if (loadedCount === TOTAL_FRAMES) {
          setIsLoaded(true);
        }
      };

      img.onerror = () => {
        loadedCount++;
        const progress = Math.floor((loadedCount / TOTAL_FRAMES) * 100);
        setLoadingProgress(progress);
        if (loadedCount === TOTAL_FRAMES) {
          setIsLoaded(true);
        }
      };

      imagesList[idx] = img;
    }
    preloadedImages.current = imagesList;

    // --- 2. GSAP Scroll-Bound Sequence Animation ---
    const playhead = playheadRef.current;
    const sequenceTween = gsap.to(playhead, {
      frame: TOTAL_FRAMES - 1,
      snap: 'frame',
      ease: 'none',
      scrollTrigger: {
        trigger: document.documentElement,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.5,
        invalidateOnRefresh: true,
      },
    });

    // Refresh ScrollTrigger to align layouts
    const refreshTimeout = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 500);

    // --- 3. Interactive Mouse Parallax dampening ---
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      targetMouseX = (event.clientX / window.innerWidth - 0.5) * 2;
      targetMouseY = (event.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // --- 4. Main Animation Frame Draw Loop ---
    let animFrameId: number;

    const draw = () => {
      // Smoothly damp mouse coordinate changes
      mouseX += (targetMouseX - mouseX) * 0.08;
      mouseY += (targetMouseY - mouseY) * 0.08;

      ctx.clearRect(0, 0, width, height);

      const currentFrame = Math.round(playhead.frame);
      const activeImg = preloadedImages.current[currentFrame];
      const isImageValid = activeImg && activeImg.complete && activeImg.naturalWidth !== 0;

      if (isImageValid) {
        // Compute "cover" scale and center offsets
        const imgRatio = activeImg.width / activeImg.height;
        const canvasRatio = width / height;
        let drawW = width;
        let drawH = height;
        let dx = 0;
        let dy = 0;

        if (imgRatio > canvasRatio) {
          drawW = height * imgRatio;
          dx = (width - drawW) / 2;
        } else {
          drawH = width / imgRatio;
          dy = (height - drawH) / 2;
        }

        // Apply interactive 3D parallax offsets
        const shiftX = mouseX * -30;
        const shiftY = mouseY * -30;

        ctx.drawImage(activeImg, dx + shiftX, dy + shiftY, drawW, drawH);
      } else {
        // Premium mathematical vector fallback so screen is never blank
        const centerX = width / 2;
        const centerY = height / 2;
        const sizeBase = Math.min(width, height) * 0.35;

        ctx.save();
        ctx.strokeStyle = 'rgba(37, 99, 235, 0.1)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(centerX + mouseX * 20, centerY + mouseY * 20, sizeBase, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      animFrameId = requestAnimationFrame(draw);
    };

    draw();

    // --- Handle Resize ---
    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      clearTimeout(refreshTimeout);
      sequenceTween.kill();
      if (sequenceTween.scrollTrigger) {
        sequenceTween.scrollTrigger.kill();
      }
    };
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 w-full h-full -z-10 bg-slate-50 overflow-hidden pointer-events-none">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover" />

      {/* Futuristic, non-blocking subtle corner loader */}
      {!isLoaded && (
        <div className="absolute bottom-6 right-6 glass-panel px-4 py-2 border border-blue-500/20 shadow-sm flex items-center gap-3 text-xxs font-extrabold text-blue-600 uppercase tracking-widest pointer-events-auto">
          <div className="w-3.5 h-3.5 border-2 border-t-blue-600 border-blue-600/20 rounded-full animate-spin" />
          Preloading HUD Sequences: {loadingProgress}%
        </div>
      )}
    </div>
  );
};
