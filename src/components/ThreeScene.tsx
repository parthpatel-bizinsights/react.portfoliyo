import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const PARTICLE_COUNT = 3000;

export const ThreeScene: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef({ progress: 0, currentShape: 0 });

  useEffect(() => {
    if (!containerRef.current) return;

    // --- Scene Setup ---
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0xf8fafc, 0.05);

    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      100,
    );
    camera.position.set(0, 0, 5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0xf8fafc, 0); // Transparent to blend with HTML background
    containerRef.current.appendChild(renderer.domElement);

    // --- Lighting ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x2563eb, 3, 15); // Primary Blue
    pointLight1.position.set(2, 2, 2);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x0ea5e9, 2, 15); // Accent Sky
    pointLight2.position.set(-2, -2, 2);
    scene.add(pointLight2);

    // --- Generate Particle Shapes ---
    const initialPositions = new Float32Array(PARTICLE_COUNT * 3);
    const targetPositions: Float32Array[] = [];

    // Base math helper to create forms
    const createShape = (
      formFn: (i: number) => { x: number; y: number; z: number },
    ) => {
      const positions = new Float32Array(PARTICLE_COUNT * 3);
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const { x, y, z } = formFn(i);
        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;
      }
      return positions;
    };

    // Shape 0: Cinematic Torus Knot (Hero)
    const torusKnotPositions = createShape((i) => {
      const q = 3;
      const p = 2;
      const phi = (i / PARTICLE_COUNT) * Math.PI * 2 * 24;
      const r = 1.0 + 0.4 * Math.cos(q * phi);
      const x = r * Math.cos(p * phi);
      const y = r * Math.sin(p * phi);
      const z = 0.4 * Math.sin(q * phi) + (Math.random() - 0.5) * 0.05;
      return { x, y, z };
    });

    // Shape 1: Tech Workspace Grid (About)
    const gridPositions = createShape((i) => {
      const cols = 50;
      const rows = Math.ceil(PARTICLE_COUNT / cols);
      const col = i % cols;
      const row = Math.floor(i / cols);
      const x = (col / cols - 0.5) * 4;
      const y = (row / rows - 0.5) * 3;
      const z = Math.sin(x * 3) * Math.cos(y * 3) * 0.25;
      return { x, y, z };
    });

    // Shape 2: Cosmic Skills Orbit Sphere (Skills)
    const spherePositions = createShape(() => {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 1.6 + (Math.random() - 0.5) * 0.15;
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      return { x, y, z };
    });

    // Shape 3: Parallax Device Mockup Planes (Projects)
    const planesPositions = createShape((i) => {
      const layer = i % 3; // 3 distinct float planes
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.random() * 1.5;
      const x = Math.cos(angle) * dist;
      const y = Math.sin(angle) * dist;
      const z = (layer - 1) * 0.8 + (Math.random() - 0.5) * 0.08;
      return { x, y, z };
    });

    // Shape 4: DNA Double Helix Timeline (Timeline)
    const helixPositions = createShape((i) => {
      const strand = i % 2;
      const angle = (i / PARTICLE_COUNT) * Math.PI * 2 * 12 + strand * Math.PI;
      const radius = 0.8;
      const x = Math.cos(angle) * radius + (Math.random() - 0.5) * 0.05;
      const y = (i / PARTICLE_COUNT - 0.5) * 4.5;
      const z = Math.sin(angle) * radius + (Math.random() - 0.5) * 0.05;
      return { x, y, z };
    });

    // Shape 5: Compact Singularity Point (Contact)
    const singularityPositions = createShape(() => {
      const angle = Math.random() * Math.PI * 2;
      const r = Math.pow(Math.random(), 3) * 0.4; // densely clustered
      const x = Math.cos(angle) * r;
      const y = Math.sin(angle) * r;
      const z = (Math.random() - 0.5) * r;
      return { x, y, z };
    });

    targetPositions.push(
      torusKnotPositions,
      gridPositions,
      spherePositions,
      planesPositions,
      helixPositions,
      singularityPositions,
    );

    // Initial position copy
    for (let i = 0; i < initialPositions.length; i++) {
      initialPositions[i] = torusKnotPositions[i];
    }

    // --- Create Particles Mesh ---
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(initialPositions, 3),
    );

    // Custom glowing circle canvas texture for particles
    const createParticleTexture = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 32;
      canvas.height = 32;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
        gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
        gradient.addColorStop(0.3, "rgba(56, 189, 248, 0.8)"); // Light blue glow
        gradient.addColorStop(0.6, "rgba(37, 99, 235, 0.2)"); // Dark blue outer halo
        gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 32, 32);
      }
      return new THREE.CanvasTexture(canvas);
    };

    const material = new THREE.PointsMaterial({
      size: 0.12,
      map: createParticleTexture(),
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Add extra ambient floating stardust for cinematic depth
    const dustGeometry = new THREE.BufferGeometry();
    const dustPositions = new Float32Array(500 * 3);
    for (let i = 0; i < 500; i++) {
      dustPositions[i * 3] = (Math.random() - 0.5) * 10;
      dustPositions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      dustPositions[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    dustGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(dustPositions, 3),
    );
    const dustMaterial = new THREE.PointsMaterial({
      size: 0.05,
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.3,
      blending: THREE.AdditiveBlending,
    });
    const dust = new THREE.Points(dustGeometry, dustMaterial);
    scene.add(dust);

    // --- Interactive Mouse Dynamics ---
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      targetMouseX = (event.clientX / window.innerWidth - 0.5) * 2;
      targetMouseY = -(event.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", handleMouseMove);

    // --- ScrollTrigger Setup ---
    // Seamlessly map full vertical scroll to 3D canvas coordinate sweeps and shape transitions
    ScrollTrigger.create({
      trigger: "body",
      start: "top top",
      end: "bottom bottom",
      scrub: 1.2,
      onUpdate: (self) => {
        // Linear scroll progress (0 to 1)
        const progress = self.progress;
        scrollRef.current.progress = progress;

        // Map progress to active segment targets (0 to 5)
        const scaledProgress = progress * 5;
        // const index = Math.floor(scaledProgress);
        // const faction = scaledProgress - index;

        scrollRef.current.currentShape = scaledProgress;

        // Interpolate camera parameters dynamic pathways based on scroll
        const camZ = 5 - progress * 2.2;
        const camX = Math.sin(progress * Math.PI * 1.5) * 1.2;
        const camY = Math.cos(progress * Math.PI) * 0.6;

        gsap.to(camera.position, {
          x: camX,
          y: camY,
          z: camZ,
          duration: 0.5,
          overwrite: "auto",
        });

        // Rotate scene slightly based on scroll depth
        gsap.to(particles.rotation, {
          y: progress * Math.PI * 3,
          x: progress * Math.PI * 0.4,
          duration: 0.8,
          overwrite: "auto",
        });
      },
    });

    // --- Render Loop & Animation ---
    const positionAttribute = geometry.getAttribute(
      "position",
    ) as THREE.BufferAttribute;
    const currentPositions = positionAttribute.array as Float32Array;

    const clock = new THREE.Clock();

    const animate = () => {
      requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Dampen mouse movement for smooth cinematic parallax
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      // Subtle dynamic camera offset reacting to mouse move
      camera.position.x += (mouseX * 0.4 - camera.position.x) * 0.02;
      camera.position.y += (mouseY * 0.4 - camera.position.y) * 0.02;
      camera.lookAt(0, 0, 0);

      // Light rotation
      pointLight1.position.x = Math.sin(elapsedTime * 0.8) * 3 + mouseX * 2;
      pointLight1.position.y = Math.cos(elapsedTime * 0.6) * 3 + mouseY * 2;
      pointLight2.position.x = Math.cos(elapsedTime * 0.5) * -3;
      pointLight2.position.y = Math.sin(elapsedTime * 0.7) * -3;

      // Animate ambient dust stardust drift
      const dustArray = dustGeometry.getAttribute("position")
        .array as Float32Array;
      for (let i = 0; i < 500; i++) {
        dustArray[i * 3 + 1] -= 0.002; // drift downwards
        if (dustArray[i * 3 + 1] < -5) {
          dustArray[i * 3 + 1] = 5;
        }
      }
      dustGeometry.getAttribute("position").needsUpdate = true;

      // --- Mathematical Particle Morphing Engine ---
      const activeShapeVal = scrollRef.current.currentShape;
      const baseIdx = Math.floor(activeShapeVal);
      const nextIdx = Math.min(baseIdx + 1, targetPositions.length - 1);
      const lerpFactor = activeShapeVal - baseIdx;

      const sourceShape = targetPositions[baseIdx];
      const targetShape = targetPositions[nextIdx];

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const i3 = i * 3;

        // Base shape coordinates (linearly interpolated)
        const sourceX = sourceShape[i3];
        const sourceY = sourceShape[i3 + 1];
        const sourceZ = sourceShape[i3 + 2];

        const targetX = targetShape[i3];
        const targetY = targetShape[i3 + 1];
        const targetZ = targetShape[i3 + 2];

        const basePosValX = sourceX + (targetX - sourceX) * lerpFactor;
        const basePosValY = sourceY + (targetY - sourceY) * lerpFactor;
        const basePosValZ = sourceZ + (targetZ - sourceZ) * lerpFactor;

        // Add subtle wave ripple based on sin waves for organic fluid feel
        const ripple =
          Math.sin(elapsedTime * 2 + basePosValX * 2 + basePosValY * 2) * 0.04;

        currentPositions[i3] = basePosValX + ripple * mouseX;
        currentPositions[i3 + 1] = basePosValY + ripple * mouseY;
        currentPositions[i3 + 2] = basePosValZ + ripple;
      }

      positionAttribute.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    // --- Handle Resize ---
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    // --- Cleanup ---
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      if (containerRef.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 w-full h-full -z-10 bg-slate-50 transition-colors duration-1000 overflow-hidden pointer-events-none"
      id="canvas-container"
      style={{ background: "#F8FAFC" }}
    />
  );
};
