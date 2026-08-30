import React, { useRef, useEffect, useState, useMemo } from 'react';
import { audioManager } from '../../audio/AudioManager';
import { ProjectArtifactViewer } from './ProjectArtifactViewer';


// ─────────────────────────────────────────────────────────────────────────────
// 1. WAVEFORM AS ARCHITECTURE
// Three parallel wave bands — music turned into landscape terrain
// ─────────────────────────────────────────────────────────────────────────────
const WaveformTerrain = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let animId: number;

    const render = () => {
      const W = (canvas.width = canvas.clientWidth);
      const H = (canvas.height = canvas.clientHeight);
      const ctx = canvas.getContext('2d');
      if (!ctx) { animId = requestAnimationFrame(render); return; }
      ctx.clearRect(0, 0, W, H);

      const raw = audioManager.getAudioTimeData();
      const isPlaying = audioManager.getIsPlaying();
      const t = Date.now() * 0.001;

      // Draw 3 parallel bands — creating terrain / ribbon effect
      const bands = [
        { yBase: 0.35, amp: 0.28, color: '#00ffe1', opacity: 0.75, width: 2.5, shadow: 22, freq: 1.0 },
        { yBase: 0.50, amp: 0.20, color: '#00ffe1', opacity: 0.30, width: 1.2, shadow: 8,  freq: 1.1 },
        { yBase: 0.62, amp: 0.16, color: '#b400ff', opacity: 0.40, width: 1.0, shadow: 12, freq: 0.9 },
      ];

      bands.forEach((band) => {
        const grad = ctx.createLinearGradient(0, 0, W, 0);
        grad.addColorStop(0,    `${band.color}00`);
        grad.addColorStop(0.08, `${band.color}${Math.round(band.opacity * 255).toString(16).padStart(2,'0')}`);
        grad.addColorStop(0.92, `${band.color}${Math.round(band.opacity * 255).toString(16).padStart(2,'0')}`);
        grad.addColorStop(1,    `${band.color}00`);

        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = grad;
        ctx.lineWidth = band.width;
        ctx.shadowBlur = band.shadow;
        ctx.shadowColor = band.color;

        for (let i = 0; i <= W; i++) {
          const frac = i / W;
          const idx = Math.floor(frac * raw.length);
          const v = isPlaying
            ? (raw[idx] / 128 - 1) * band.freq
            : Math.sin(frac * Math.PI * 6 + t * 1.1 * band.freq) * 0.38
              + Math.sin(frac * Math.PI * 14 + t * 0.5) * 0.12;
          // Bend toward void (center, ~65vh) — slight downward pull in middle
          const voidPull = Math.sin(frac * Math.PI) * 0.04;
          const y = H * (band.yBase + voidPull) + v * H * band.amp;
          i === 0 ? ctx.moveTo(i, y) : ctx.lineTo(i, y);
        }
        ctx.stroke();
        ctx.restore();
      });

      // Filled terrain between band 1 and 2
      ctx.save();
      ctx.beginPath();
      for (let i = 0; i <= W; i++) {
        const frac = i / W;
        const idx = Math.floor(frac * raw.length);
        const v = isPlaying ? (raw[idx] / 128 - 1) : Math.sin(frac * Math.PI * 6 + t * 1.1) * 0.38;
        const y = H * (0.35 + Math.sin(frac * Math.PI) * 0.04) + v * H * 0.28;
        i === 0 ? ctx.moveTo(i, y) : ctx.lineTo(i, y);
      }
      for (let i = W; i >= 0; i--) {
        const frac = i / W;
        const idx = Math.floor(frac * raw.length);
        const v = isPlaying ? (raw[idx] / 128 - 1) : Math.sin(frac * Math.PI * 6 + t * 1.1) * 0.20;
        const y = H * (0.50 + Math.sin(frac * Math.PI) * 0.04) + v * H * 0.20;
        ctx.lineTo(i, y);
      }
      ctx.closePath();
      ctx.fillStyle = 'rgba(0,255,225,0.025)';
      ctx.fill();
      ctx.restore();

      animId = requestAnimationFrame(render);
    };
    render();
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <canvas ref={canvasRef} style={{
      position: 'absolute', left: 0,
      top: 'clamp(50px, 6vh, 100px)',
      width: '100%', height: '220px',
      zIndex: 4, pointerEvents: 'none',
    }} />
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 2. FOREGROUND: GIANT MONITOR FRAGMENT
// Enormous — partially off the left edge. You are inside the workstation.
// ─────────────────────────────────────────────────────────────────────────────
const GiantMonitorForeground = () => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let id: number, s = 0;
    const loop = () => {
      s += 0.0003;
      if (ref.current) {
        const drift = Math.sin(s) * 3;
        ref.current.style.transform = `perspective(1200px) rotateY(18deg) rotateX(-8deg) translateY(${drift}px)`;
      }
      id = requestAnimationFrame(loop);
    };
    loop();
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div style={{ position: 'absolute', left: '-120px', top: '18vh', zIndex: 10, pointerEvents: 'none' }}>
      <div ref={ref} style={{ width: 'clamp(320px,42vw,580px)', transformOrigin: 'left center', willChange: 'transform' }}>
        {/* Bezel */}
        <div style={{
          background: '#070712',
          border: '4px solid rgba(0,255,225,0.25)',
          borderRadius: '6px',
          overflow: 'hidden',
          boxShadow: '0 0 0 1px rgba(0,255,225,0.15), 15px 30px 100px rgba(0,0,0,0.95), 0 0 80px rgba(0,255,225,0.15)',
        }}>
          {/* Browser bar */}
          <div style={{ height: '24px', background: '#05050d', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', padding: '0 10px', gap: '5px' }}>
            {['#ff5f57','#febc2e','#28c840'].map((c,i) => <div key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: c, opacity: 0.8 }} />)}
            <div style={{ marginLeft: '10px', flex: 1, height: '12px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px' }} />
          </div>
          {/* Corrupted screen */}
          <div style={{ height: 'clamp(120px,18vh,230px)', background: 'linear-gradient(135deg, #07071a 0%, #0a0a28 100%)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.20) 3px, rgba(0,0,0,0.20) 6px)' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 40% 50%, rgba(0,255,225,0.15) 0%, transparent 80%)' }} />
            {/* Glitch lines */}
            {[22, 45, 63, 78].map((top, i) => (
              <div key={i} style={{ position: 'absolute', top: `${top}%`, left: `${10 + i * 12}%`, width: `${20 + i * 8}%`, height: '2px', background: `rgba(0,255,225,${0.2 + i * 0.1})`, boxShadow: '0 0 10px rgba(0,255,225,0.4)' }} />
            ))}
          </div>
        </div>
        {/* Stand */}
        <div style={{ width: '30%', height: '10px', background: '#05050a', margin: '0 auto', borderBottom: '1px solid rgba(255,255,255,0.06)' }} />
        <div style={{ width: '18%', height: '4px', background: '#030307', margin: '0 auto' }} />
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 3. FLOATING KEYBOARD — suspended at an impossible angle
// ─────────────────────────────────────────────────────────────────────────────
const FloatingKeyboard = () => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let id: number, s = 0;
    const loop = () => {
      s += 0.0002;
      if (ref.current) {
        const y = Math.sin(s) * 6;
        const r = Math.cos(s * 0.7) * 2;
        ref.current.style.transform = `perspective(600px) rotateX(52deg) rotateZ(-8deg) translateY(${y}px) rotateX(${r}deg)`;
      }
      id = requestAnimationFrame(loop);
    };
    loop();
    return () => cancelAnimationFrame(id);
  }, []);

  const keys = useMemo(() => {
    const rows = [10, 10, 9, 8, 5];
    return rows;
  }, []);

  return (
    <div style={{ position: 'absolute', right: 'clamp(2%, 4vw, 7%)', top: '48vh', zIndex: 6, pointerEvents: 'none', opacity: 0.85 }}>
      <div ref={ref} style={{ transformOrigin: 'center center', willChange: 'transform' }}>
        <div style={{ background: '#0a0a14', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '6px', padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: '5px', width: 'clamp(140px,18vw,240px)', boxShadow: '0 20px 60px rgba(0,0,0,0.8), inset 0 0 20px rgba(0,255,225,0.05)' }}>
          {keys.map((count, row) => (
            <div key={row} style={{ display: 'flex', gap: '4px', justifyContent: row === keys.length - 1 ? 'center' : 'flex-start' }}>
              {Array.from({ length: count }, (_, k) => (
                <div key={k} style={{
                  flex: row === keys.length - 1 && k === 2 ? 3 : 1,
                  height: 'clamp(10px,1.4vw,18px)',
                  background: Math.random() > 0.8 ? 'rgba(0,255,225,0.35)' : 'rgba(255,255,255,0.12)',
                  borderRadius: '2px',
                  border: '1px solid rgba(255,255,255,0.10)',
                  boxShadow: Math.random() > 0.8 ? '0 0 8px rgba(0,255,225,0.4)' : 'inset 0 1px 2px rgba(255,255,255,0.05)',
                }} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 4. PROJECT SCREEN — a physical monitor with the project embedded in it
// Click it to open the case study
// ─────────────────────────────────────────────────────────────────────────────
interface ProjectScreenProps {
  style?: React.CSSProperties;
  tiltY?: number;
  tiltX?: number;
  projectNum: string;
  title: string;
  sub: string;
  color: string;
  tag: string;
  form?: 'desktop' | 'laptop' | 'phone';
  driftPhase?: number;
  onClick: () => void;
}

const ProjectScreen: React.FC<ProjectScreenProps> = ({
  style = {},
  tiltY = -8,
  tiltX = 3,
  projectNum,
  title,
  sub,
  color,
  tag,
  form = 'desktop',
  driftPhase = 0,
  onClick,
}) => {
  const [hovered, setHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let id: number, s = driftPhase;
    const loop = () => {
      s += 0.00015;
      if (ref.current && !hovered) {
        const dy = Math.sin(s) * 5;
        const dr = Math.cos(s * 0.6) * 1.5;
        ref.current.style.transform = `perspective(900px) rotateY(${tiltY + dr}deg) rotateX(${tiltX}deg) translateY(${dy}px)`;
      } else if (ref.current && hovered) {
        ref.current.style.transform = `perspective(900px) rotateY(${tiltY * 0.3}deg) rotateX(${tiltX * 0.3}deg) scale(1.03)`;
      }
      id = requestAnimationFrame(loop);
    };
    loop();
    return () => cancelAnimationFrame(id);
  }, [hovered, tiltY, tiltX, driftPhase]);

  const w = { desktop: 'clamp(230px,32vw,440px)', laptop: 'clamp(190px,26vw,360px)', phone: 'clamp(100px,13vw,175px)' }[form];
  const h = { desktop: 'clamp(110px,16vh,190px)', laptop: 'clamp(90px,13vh,160px)', phone: 'clamp(160px,22vh,240px)' }[form];

  return (
    <div style={{ zIndex: 8, cursor: 'pointer', ...style }}>
      <div
        ref={ref}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={onClick}
        style={{ width: w, transformOrigin: 'center center', transition: hovered ? 'transform 0.5s cubic-bezier(0.22,1,0.36,1)' : 'none', willChange: 'transform' }}
      >
        {/* Monitor body */}
        <div style={{
          background: '#06060e',
          border: `1px solid ${hovered ? color + '50' : color + '18'}`,
          borderRadius: form === 'phone' ? '10px' : '3px',
          overflow: 'hidden',
          transition: 'border-color 0.4s, box-shadow 0.4s',
          boxShadow: hovered
            ? `0 0 0 1px ${color}40, 0 30px 100px rgba(0,0,0,0.95), 0 0 60px ${color}10`
            : `0 0 0 1px ${color}0a, 0 16px 60px rgba(0,0,0,0.85)`,
        }}>
          {/* Chrome bar */}
          {form !== 'phone' && (
            <div style={{ height: '22px', background: '#030308', borderBottom: '1px solid rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', padding: '0 8px', gap: '4px' }}>
              {['#ff5f57','#febc2e','#28c840'].map((c,i) => <div key={i} style={{ width: 5, height: 5, borderRadius: '50%', background: c, opacity: 0.65 }} />)}
              <div style={{ marginLeft: '6px', flex: 1, height: '10px', background: 'rgba(255,255,255,0.03)', borderRadius: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontFamily: 'monospace', fontSize: '6px', color: 'rgba(255,255,255,0.15)', letterSpacing: '0.06em' }}>
                  {projectNum === '01' ? 'inesh-portfolio.vercel.app' : projectNum === '02' ? 'figma.com/design/...' : 'ux-research.figma.com'}
                </span>
              </div>
            </div>
          )}
          {/* Phone notch */}
          {form === 'phone' && <div style={{ height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div style={{ width: '35px', height: '3px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px' }} /></div>}

          {/* Screen */}
          <div style={{ height: h, background: 'linear-gradient(140deg, #05050e 0%, #0a0a1c 100%)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.06) 2px, rgba(0,0,0,0.06) 4px)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at 30% 40%, ${color}07 0%, transparent 65%)`, pointerEvents: 'none' }} />

            <div style={{ position: 'relative', padding: 'clamp(12px,2vw,22px)' }}>
              <p style={{ fontFamily: 'monospace', fontSize: '7px', letterSpacing: '0.38em', color: color + '70', marginBottom: '7px' }}>
                {projectNum} // PROJECT
              </p>
              <h3 style={{
                fontFamily: '"Helvetica Neue", Arial, sans-serif',
                fontSize: form === 'phone' ? 'clamp(13px,2.2vw,18px)' : 'clamp(16px,2.8vw,28px)',
                fontWeight: 800,
                color: 'rgba(255,255,255,0.92)',
                letterSpacing: '-0.02em',
                lineHeight: 1.05,
                marginBottom: '7px',
                whiteSpace: 'pre-line',
              }}>
                {title}
              </h3>
              <p style={{ fontFamily: 'monospace', fontSize: '7px', letterSpacing: '0.18em', color: 'rgba(255,255,255,0.20)', marginBottom: '10px' }}>
                {sub}
              </p>
              <span style={{ fontFamily: 'monospace', fontSize: '6px', letterSpacing: '0.16em', color: color, border: `1px solid ${color}28`, padding: '2px 6px', borderRadius: '2px', background: color + '0a' }}>
                {hovered ? '↗ OPEN' : tag}
              </span>
            </div>
          </div>
        </div>

        {/* Stand (desktop only) */}
        {form === 'desktop' && (
          <>
            <div style={{ width: '32%', height: '8px', background: '#030308', margin: '0 auto', borderBottom: '1px solid rgba(255,255,255,0.03)' }} />
            <div style={{ width: '18%', height: '3px', background: '#020205', margin: '0 auto', borderRadius: '2px' }} />
          </>
        )}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 5. CABLE INFRASTRUCTURE — large, animated, going toward void
// ─────────────────────────────────────────────────────────────────────────────
const CableLayer = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let id: number;

    const draw = () => {
      const W = canvas.width = canvas.offsetWidth;
      const H = canvas.height = canvas.offsetHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) { id = requestAnimationFrame(draw); return; }
      ctx.clearRect(0, 0, W, H);

      const t = Date.now() * 0.0008;
      const fl = 0.82 + Math.sin(t * 1.6) * 0.18;

      type CableDef = { pts: [number,number,number,number,number,number,number,number], color: string, w: number, dash?: boolean };
      const cables: CableDef[] = [
        // Main monitor (top-right) → Void (center ~65vh)
        { pts: [0.60, 0.28, 0.54, 0.46, 0.46, 0.56, 0.40, 0.64], color: `rgba(0,255,225,${0.14 * fl})`, w: 1.2, dash: true },
        // Left phone → Void
        { pts: [0.20, 0.58, 0.27, 0.62, 0.33, 0.65, 0.40, 0.64], color: `rgba(180,0,255,${0.12 * fl})`, w: 1, dash: true },
        // Tablet (right ~85vh) → Void
        { pts: [0.68, 0.84, 0.58, 0.80, 0.48, 0.73, 0.40, 0.64], color: `rgba(232,168,74,${0.10 * fl})`, w: 1, dash: true },
        // Giant cable from far left → off-screen bottom (structural)
        { pts: [-0.05, 0.10, 0.15, 0.30, 0.25, 0.55, 0.38, 0.65], color: `rgba(0,200,180,${0.07 * fl})`, w: 2 },
        // Vine from right edge across top
        { pts: [1.05, 0.05, 0.70, 0.11, 0.40, 0.08, 0.05, 0.20], color: `rgba(0,255,225,${0.05 * fl})`, w: 1.5 },
        // Waveform tail into void
        { pts: [0.48, 0.10, 0.46, 0.32, 0.42, 0.50, 0.40, 0.64], color: `rgba(0,255,225,${0.06 * fl})`, w: 0.8 },
        // Disappearing cable off bottom-right
        { pts: [0.85, 0.80, 0.75, 0.90, 0.65, 1.02, 0.55, 1.10], color: `rgba(180,0,255,${0.06 * fl})`, w: 1 },
      ];

      cables.forEach(({ pts, color, w, dash }) => {
        const [x1,y1,cx1,cy1,cx2,cy2,x2,y2] = pts;
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(x1 * W, y1 * H);
        ctx.bezierCurveTo(cx1 * W, cy1 * H, cx2 * W, cy2 * H, x2 * W, y2 * H);
        ctx.strokeStyle = color;
        ctx.lineWidth = w;
        if (dash) ctx.setLineDash([4, 8]);
        ctx.stroke();
        if (dash) ctx.setLineDash([]);
        ctx.restore();
      });

      id = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(id);
  }, []);

  return <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 3, pointerEvents: 'none' }} />;
};

// ─────────────────────────────────────────────────────────────────────────────
// 6. PARTICLE FLOW — tiny fragments drifting toward the void
// ─────────────────────────────────────────────────────────────────────────────
const ParticleFlow = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const particles = useMemo(() => Array.from({ length: 60 }, () => ({
    x: Math.random(), y: Math.random() * 0.8 + 0.05,
    size: 0.5 + Math.random() * 2,
    speed: 0.00005 + Math.random() * 0.0001,
    color: Math.random() > 0.5 ? '#00ffe1' : Math.random() > 0.5 ? '#b400ff' : '#e8a84a',
    opacity: 0.1 + Math.random() * 0.4,
    angle: Math.random() * Math.PI * 2,
  })), []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let id: number;
    const state = particles.map(p => ({ ...p }));

    const draw = () => {
      const W = canvas.width = canvas.offsetWidth;
      const H = canvas.height = canvas.offsetHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) { id = requestAnimationFrame(draw); return; }
      ctx.clearRect(0, 0, W, H);

      // Void center
      const vx = 0.40 * W, vy = 0.64 * H;

      state.forEach((p) => {
        const px = p.x * W, py = p.y * H;
        const dx = vx - px, dy = vy - py;
        const dist = Math.sqrt(dx * dx + dy * dy);
        // Pull toward void
        const pull = p.speed * (500 / Math.max(dist, 80));
        p.x += (dx / dist) * pull;
        p.y += (dy / dist) * pull;
        // Drift
        p.x += Math.cos(p.angle) * p.speed * 0.3;
        p.y += Math.sin(p.angle) * p.speed * 0.3;
        p.angle += 0.005;

        // Reset when reaching void
        if (dist < 25) {
          p.x = Math.random();
          p.y = Math.random() * 0.8 + 0.05;
        }

        ctx.save();
        ctx.globalAlpha = p.opacity * (1 - Math.max(0, 1 - dist / 100));
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 4;
        ctx.shadowColor = p.color;
        ctx.beginPath();
        ctx.arc(p.x * W, p.y * H, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      id = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(id);
  }, [particles]);

  return <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 5, pointerEvents: 'none' }} />;
};

// ─────────────────────────────────────────────────────────────────────────────
// 7. CENTRAL VOID — gravitational center, everything bends toward it
// ─────────────────────────────────────────────────────────────────────────────
const CentralVoid = () => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let id: number, t = 0;
    const loop = () => {
      t += 0.005;
      if (ref.current) {
        const s = 1 + Math.sin(t * 1.1) * 0.04;
        ref.current.style.transform = `translate(-50%, -50%) scale(${s})`;
      }
      id = requestAnimationFrame(loop);
    };
    loop();
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div style={{ position: 'absolute', left: '40%', top: '64vh', zIndex: 7, pointerEvents: 'none' }}>
      <div ref={ref} style={{ transformOrigin: 'center center', willChange: 'transform' }}>
        {/* Outer ring */}
        <div style={{ position: 'absolute', width: '180px', height: '180px', borderRadius: '50%', border: '1px solid rgba(130,0,200,0.10)', top: '-90px', left: '-90px', transform: 'scale(1.6)' }} />
        {/* Mid ring */}
        <div style={{ position: 'absolute', width: '120px', height: '120px', borderRadius: '50%', border: '1px solid rgba(130,0,200,0.14)', top: '-60px', left: '-60px', transform: 'scale(1.2)' }} />
        {/* Core */}
        <div style={{
          width: '90px', height: '90px', borderRadius: '50%',
          background: 'radial-gradient(circle, #000 20%, rgba(24,0,48,0.7) 55%, transparent 100%)',
          boxShadow: '0 0 0 1px rgba(120,0,190,0.18), 0 0 60px rgba(80,0,150,0.12)',
          transform: 'translate(-50%, -50%)',
        }} />
      </div>
      <p style={{ fontFamily: 'monospace', fontSize: '6px', letterSpacing: '0.55em', color: 'rgba(120,0,190,0.25)', textAlign: 'center', marginTop: '6px', transform: 'translateX(-50%)', position: 'absolute', bottom: '-22px', left: '0' }}>
        VOID
      </p>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 8. BACKGROUND: RECURSIVE / DISTANT SCREENS
// Tiny, distant, partial — gives a sense of deep space
// ─────────────────────────────────────────────────────────────────────────────
const DistantScreens = () => {
  const screens = [
    { left: '55%', top: '15vh', w: '90px', h: '55px', tilt: 'rotateY(-20deg) rotateX(8deg)', opacity: 0.15, color: '#00ffe1' },
    { left: '72%', top: '35vh', w: '60px', h: '38px', tilt: 'rotateY(25deg) rotateX(-5deg)', opacity: 0.10, color: '#b400ff' },
    { left: '15%', top: '20vh', w: '70px', h: '44px', tilt: 'rotateY(-15deg) rotateX(10deg)', opacity: 0.12, color: '#e8a84a' },
    { left: '80%', top: '60vh', w: '50px', h: '32px', tilt: 'rotateY(30deg) rotateX(-8deg)', opacity: 0.08, color: '#00ffe1' },
    { left: '28%', top: '78vh', w: '80px', h: '50px', tilt: 'rotateY(-18deg) rotateX(6deg)', opacity: 0.10, color: '#b400ff' },
  ];

  return (
    <>
      {screens.map((s, i) => (
        <div key={i} style={{
          position: 'absolute', left: s.left, top: s.top,
          perspective: '500px', zIndex: 2, pointerEvents: 'none',
        }}>
          <div style={{
            width: s.w, height: s.h,
            background: '#050510',
            border: `1px solid ${s.color}20`,
            transform: s.tilt,
            opacity: s.opacity,
            boxShadow: `0 0 20px ${s.color}08`,
            borderRadius: '2px',
            overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.15) 3px, rgba(0,0,0,0.15) 6px)' }} />
            <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at 40% 40%, ${s.color}10 0%, transparent 70%)` }} />
          </div>
        </div>
      ))}
    </>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 9. ROOM REMNANTS — vinyl, amber warmth
// ─────────────────────────────────────────────────────────────────────────────
const RoomRemnants = () => (
  <>
    {/* Amber glow — warmth from the room */}
    <div style={{ position: 'absolute', left: '5%', top: '35vh', width: '200px', height: '200px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(232,168,74,0.09) 0%, transparent 70%)', filter: 'blur(28px)', pointerEvents: 'none', zIndex: 1 }} />
    <div style={{ position: 'absolute', right: '6%', top: '88vh', width: '120px', height: '120px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(232,168,74,0.06) 0%, transparent 70%)', filter: 'blur(20px)', pointerEvents: 'none', zIndex: 1 }} />
    {/* Vinyl disc — partially off-screen left */}
    <div style={{ position: 'absolute', left: '-75px', top: '55vh', width: '190px', height: '190px', borderRadius: '50%', background: 'repeating-radial-gradient(circle, #0c0c18 0px, #0c0c18 2px, #16162a 3px, #0c0c18 5px)', border: '1px solid rgba(232,168,74,0.08)', zIndex: 2, pointerEvents: 'none', opacity: 0.5 }}>
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '24px', height: '24px', borderRadius: '50%', background: '#050510', border: '1px solid rgba(232,168,74,0.20)' }} />
    </div>
  </>
);

// ─────────────────────────────────────────────────────────────────────────────
// 10. GHOST FRAME — workspace growing
// ─────────────────────────────────────────────────────────────────────────────
const GhostFrame = () => (
  <div style={{ position: 'absolute', left: 'clamp(6%, 9vw, 14%)', top: '112vh', width: 'clamp(160px,22vw,280px)', zIndex: 5, pointerEvents: 'none' }}>
    <div style={{ border: '1px dashed rgba(255,255,255,0.06)', borderRadius: '2px', height: 'clamp(80px,11vh,140px)', background: 'rgba(255,255,255,0.005)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
      {/* Corner marks */}
      {[{t:'0',l:'0',bt:false,bl:false},{t:'auto',b:'0',l:'0',bt:true,bl:false},{t:'0',l:'auto',r:'0',bt:false,bl:true},{t:'auto',b:'0',l:'auto',r:'0',bt:true,bl:true}].map((c,i) => (
        <div key={i} style={{
          position:'absolute', top:c.t, bottom:(c as any).b, left:c.l, right:(c as any).r,
          width:8, height:8,
          borderTop: c.bt ? undefined : '1px solid rgba(0,255,225,0.10)',
          borderBottom: c.bt ? '1px solid rgba(0,255,225,0.10)' : undefined,
          borderLeft: c.bl ? undefined : '1px solid rgba(0,255,225,0.10)',
          borderRight: c.bl ? '1px solid rgba(0,255,225,0.10)' : undefined,
        }} />
      ))}
      <span style={{ fontFamily: 'monospace', fontSize: '7px', letterSpacing: '0.30em', color: 'rgba(255,255,255,0.08)' }}>// BUILDING</span>
    </div>
    <p style={{ fontFamily: 'monospace', fontSize: '6px', letterSpacing: '0.20em', color: 'rgba(255,255,255,0.05)', marginTop: '5px' }}>next artifact — in progress</p>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// MAIN EXPORT
// ─────────────────────────────────────────────────────────────────────────────
export const DigitalEnvironment: React.FC = () => {
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);

  return (
    <section style={{ position: 'relative', minHeight: '270vh', width: '100%', background: 'transparent', overflow: 'visible' }}>

      {/* Music turned landscape */}
      <WaveformTerrain />

      {/* Cables — infrastructure connecting the space */}
      <CableLayer />

      {/* Particles flowing toward the void */}
      <ParticleFlow />

      {/* Distant / background screens */}
      <DistantScreens />

      {/* Room remnants — amber, vinyl */}
      <RoomRemnants />

      {/* FOREGROUND: giant monitor fragment — you are inside the workstation */}
      <GiantMonitorForeground />

      {/* Floating keyboard — impossible physics */}
      <FloatingKeyboard />

      {/* ── PROJECT 01: THIS WEBSITE — primary artifact, large desktop ──────── */}
      <ProjectScreen
        style={{ position: 'absolute', right: 'clamp(3%, 5vw, 9%)', top: '28vh' }}
        form="desktop"
        tiltY={-10} tiltX={3}
        driftPhase={0}
        projectNum="01"
        title={"THIS\nWEBSITE"}
        sub="UI — UX — INTERACTION — SOUND"
        color="#00ffe1"
        tag="YOU ARE INSIDE IT"
        onClick={() => setActiveProjectId('1')}
      />

      {/* ── PROJECT 02: TEAM SECTION — phone form, left, lower ──────────────── */}
      <ProjectScreen
        style={{ position: 'absolute', left: 'clamp(5%, 8vw, 13%)', top: '54vh' }}
        form="phone"
        tiltY={10} tiltX={-5}
        driftPhase={2.1}
        projectNum="02"
        title={"TEAM\nSECTION"}
        sub="UI / VISUAL DESIGN"
        color="#b400ff"
        tag="FIGMA"
        onClick={() => setActiveProjectId('3')}
      />

      {/* ── PROJECT 03: EVENT DISCOVERY — laptop form, right, deep ──────────── */}
      <ProjectScreen
        style={{ position: 'absolute', right: 'clamp(7%, 11vw, 17%)', top: '84vh' }}
        form="laptop"
        tiltY={-13} tiltX={4}
        driftPhase={4.4}
        projectNum="03"
        title={"EVENT\nDISCOVERY"}
        sub="UX RESEARCH / WIREFRAMES"
        color="#e8a84a"
        tag="CASE STUDY"
        onClick={() => setActiveProjectId('2')}
      />

      {/* Gravitational center */}
      <CentralVoid />

      {/* Ghost frame — workspace growing */}
      <GhostFrame />

      {/* Case study modal */}
      <ProjectArtifactViewer
        projectId={activeProjectId}
        onClose={() => setActiveProjectId(null)}
      />
    </section>
  );
};

export default DigitalEnvironment;
