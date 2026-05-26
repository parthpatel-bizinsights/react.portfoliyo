import { useEffect, useRef } from "react";

export const SplashCursor = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Resize canvas to fill the screen perfectly
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);
    resize();

    // Particle Array to hold all our active liquid drops
    let particles: Particle[] = [];

    // Mouse tracking
    let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;
      life: number;

      constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        // Random size for variety
        this.size = Math.random() * 8 + 2;
        // Explode outward in random directions
        this.speedX = Math.random() * 6 - 3;
        this.speedY = Math.random() * 6 - 3;
        // Choose a random cool color (cyans, blues, purples)
        const colors = ["#0ea5e9", "#3b82f6", "#8b5cf6", "#2dd4bf"];
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.life = 1; // 100% opacity
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        // Add slight gravity pulling drops down
        this.speedY += 0.1;
        // Fade out and shrink over time
        this.life -= 0.02;
        if (this.size > 0.2) this.size -= 0.1;
      }

      draw(context: CanvasRenderingContext2D) {
        context.globalAlpha = Math.max(0, this.life);
        context.fillStyle = this.color;
        context.beginPath();
        context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        context.fill();
        context.globalAlpha = 1; // Reset alpha
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      // Spawn 3 particles every time the mouse moves to create the "splash"
      for (let i = 0; i < 3; i++) {
        particles.push(new Particle(mouse.x, mouse.y));
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    // The core animation loop
    let animationFrameId: number;
    const animate = () => {
      // Clear the canvas every frame
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw all particles
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw(ctx);

        // Remove dead particles from memory
        if (particles[i].life <= 0) {
          particles.splice(i, 1);
          i--;
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-9999"
    />
  );
};
