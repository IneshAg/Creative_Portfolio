import React, { useEffect, useRef } from 'react';

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  connections: number[];
  pulse: number;
}

export const NeuralNetworkCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef<{ x: number; y: number }>({ x: -1000, y: -1000 });
  const animRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    // Generate neural nodes
    const nodeCount = Math.min(65, Math.floor((width * height) / 22000));
    const nodes: Node[] = [];
    const colors = ['#00ffe1', '#b400ff', '#ffffff', '#8f90a6'];

    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() < 0.2 ? 3 : Math.random() < 0.7 ? 1.8 : 1.2,
        color: colors[Math.floor(Math.random() * colors.length)],
        connections: [],
        pulse: Math.random() * Math.PI * 2,
      });
    }

    const maxDist = 130;
    const mouseRadius = 180;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw generative background coordinate lines
      ctx.strokeStyle = 'rgba(0, 255, 225, 0.02)';
      ctx.lineWidth = 1;

      // Update and draw connections
      for (let i = 0; i < nodes.length; i++) {
        const n1 = nodes[i];
        n1.x += n1.vx;
        n1.y += n1.vy;
        n1.pulse += 0.02;

        if (n1.x < 0 || n1.x > width) n1.vx *= -1;
        if (n1.y < 0 || n1.y > height) n1.vy *= -1;

        // Mouse interaction attraction
        const dxMouse = mouseRef.current.x - n1.x;
        const dyMouse = mouseRef.current.y - n1.y;
        const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
        if (distMouse < mouseRadius) {
          const force = (1 - distMouse / mouseRadius) * 0.6;
          n1.x += (dxMouse / distMouse) * force;
          n1.y += (dyMouse / distMouse) * force;
        }

        // Draw connections between nodes
        for (let j = i + 1; j < nodes.length; j++) {
          const n2 = nodes[j];
          const dx = n1.x - n2.x;
          const dy = n1.y - n2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * 0.25;
            ctx.beginPath();
            ctx.strokeStyle = dist < 70 ? `rgba(0, 255, 225, ${alpha})` : `rgba(180, 0, 255, ${alpha})`;
            ctx.lineWidth = 0.75;
            ctx.moveTo(n1.x, n1.y);
            ctx.lineTo(n2.x, n2.y);
            ctx.stroke();

            // Occasional traveling data packet
            if (Math.sin(n1.pulse) > 0.95) {
              const t = (Math.sin(n1.pulse * 2) + 1) / 2;
              const px = n1.x + (n2.x - n1.x) * t;
              const py = n1.y + (n2.y - n1.y) * t;
              ctx.fillStyle = '#ffffff';
              ctx.fillRect(px - 1, py - 1, 2, 2);
            }
          }
        }

        // Draw node
        ctx.beginPath();
        ctx.arc(n1.x, n1.y, n1.radius, 0, Math.PI * 2);
        ctx.fillStyle = n1.color;
        ctx.shadowColor = n1.color;
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      animRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-0 opacity-70"
    />
  );
};
