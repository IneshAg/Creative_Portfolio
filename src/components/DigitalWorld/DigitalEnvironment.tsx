import React, { useRef, useEffect, useState } from 'react';
import { audioManager } from '../../audio/AudioManager';
import { ProjectArtifactViewer } from './ProjectArtifactViewer';

// ─── WAVEFORM RIBBON ──────────────────────────────────────────────────────────
// Music made architecture. Spans full width. Not a widget.
const WaveformRibbon = () => {
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
      const data = audioManager.getAudioTimeData();
      const isPlaying = audioManager.getIsPlaying();
      const t = Date.now() * 0.001;

      // Primary ribbon — cyan
      ctx.save();
      const g1 = ctx.createLinearGradient(0, 0, W, 0);
      g1.addColorStop(0, 'rgba(0,255,225,0)');
      g1.addColorStop(0.12, 'rgba(0,255,225,0.65)');
      g1.addColorStop(0.88, 'rgba(0,255,225,0.65)');
      g1.addColorStop(1, 'rgba(0,255,225,0)');
      ctx.strokeStyle = g1; ctx.lineWidth = 2.5;
      ctx.shadowBlur = 20; ctx.shadowColor = '#00ffe1';
      ctx.beginPath();
      for (let i = 0; i <= W; i++) {
        const v = isPlaying
          ? (data[Math.floor((i / W) * data.length)] / 128 - 1)
          : Math.sin((i / W) * Math.PI * 7 + t * 1.3) * 0.35 + Math.sin((i / W) * Math.PI * 17 + t * 0.6) * 0.1;
        i === 0 ? ctx.moveTo(i, H * 0.5 + v * H * 0.38) : ctx.lineTo(i, H * 0.5 + v * H * 0.38);
      }
      ctx.stroke(); ctx.restore();

      // Secondary ribbon — purple, offset
      ctx.save();
      const g2 = ctx.createLinearGradient(0, 0, W, 0);
      g2.addColorStop(0, 'rgba(180,0,255,0)');
      g2.addColorStop(0.2, 'rgba(180,0,255,0.30)');
      g2.addColorStop(0.8, 'rgba(180,0,255,0.30)');
      g2.addColorStop(1, 'rgba(180,0,255,0)');
      ctx.strokeStyle = g2; ctx.lineWidth = 1;
      ctx.shadowBlur = 8; ctx.shadowColor = '#b400ff';
      ctx.beginPath();
      for (let i = 0; i <= W; i++) {
        const v = isPlaying
          ? (data[Math.floor((i / W) * data.length)] / 128 - 1) * -0.5
          : Math.sin((i / W) * Math.PI * 10 - t * 0.8) * 0.25;
        i === 0 ? ctx.moveTo(i, H * 0.5 + v * H * 0.28 + 16) : ctx.lineTo(i, H * 0.5 + v * H * 0.28 + 16);
      }
      ctx.stroke(); ctx.restore();

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute', left: 0,
        top: 'clamp(70px, 8vh, 130px)',
        width: '100%', height: '170px',
        zIndex: 3, pointerEvents: 'none',
      }}
    />
  );
};

// ─── CABLE SYSTEM ─────────────────────────────────────────────────────────────
const CableCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let animId: number;

    const draw = () => {
      const W = canvas.width = canvas.offsetWidth;
      const H = canvas.height = canvas.offsetHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) { animId = requestAnimationFrame(draw); return; }
      ctx.clearRect(0, 0, W, H);

      const t = Date.now() * 0.001;
      const fl = 0.85 + Math.sin(t * 1.8) * 0.15;

      const cable = (x1: number, y1: number, cx1: number, cy1: number, cx2: number, cy2: number, x2: number, y2: number, color: string, w = 1, dash = false) => {
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(x1 * W, y1 * H);
        ctx.bezierCurveTo(cx1 * W, cy1 * H, cx2 * W, cy2 * H, x2 * W, y2 * H);
        ctx.strokeStyle = color;
        ctx.lineWidth = w;
        if (dash) ctx.setLineDash([4, 7]);
        ctx.stroke();
        if (dash) ctx.setLineDash([]);
        ctx.restore();
      };

      // Monitor 1 → Void
      cable(0.62, 0.33, 0.55, 0.48, 0.46, 0.57, 0.40, 0.64, `rgba(0,255,225,${0.12 * fl})`, 1, true);
      // Phone → Void
      cable(0.22, 0.60, 0.27, 0.64, 0.34, 0.66, 0.40, 0.64, `rgba(180,0,255,${0.10 * fl})`, 1, true);
      // Tablet → Void
      cable(0.70, 0.85, 0.58, 0.82, 0.48, 0.74, 0.40, 0.64, `rgba(0,255,225,${0.08 * fl})`, 1, true);
      // Vine across top
      cable(1.0, 0.06, 0.65, 0.13, 0.35, 0.09, 0.0, 0.22, `rgba(0,200,180,${0.06 * fl})`, 1.5);
      // Vinyl to left edge
      cable(0.08, 0.65, 0.02, 0.75, -0.04, 0.85, -0.08, 1.0, `rgba(232,168,74,${0.08 * fl})`, 1);

      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute', top: 0, left: 0,
        width: '100%', height: '100%',
        zIndex: 2, pointerEvents: 'none',
      }}
    />
  );
};

// ─── ARTIFACT COMPONENT ───────────────────────────────────────────────────────
// Generic wrapper that makes a project feel like a physical object in space
interface ArtifactProps {
  style?: React.CSSProperties;
  rotateY?: number;
  rotateX?: number;
  form: 'monitor' | 'phone' | 'tablet';
  projectNum: string;
  title: string;
  sub: string;
  color: string;
  tag?: string;
  onClick: () => void;
}

const Artifact: React.FC<ArtifactProps> = ({
  style = {},
  rotateY = -8,
  rotateX = 3,
  form,
  projectNum,
  title,
  sub,
  color,
  tag,
  onClick,
}) => {
  const [hovered, setHovered] = useState(false);

  const dims = {
    monitor: { w: 'clamp(240px,34vw,480px)', minH: '140px', padding: 'clamp(16px,2.5vw,28px)' },
    phone:   { w: 'clamp(130px,16vw,200px)', minH: '220px', padding: '16px' },
    tablet:  { w: 'clamp(190px,25vw,340px)', minH: '160px', padding: 'clamp(14px,2vw,22px)' },
  }[form];

  return (
    <div
      style={{
        perspective: '900px',
        zIndex: 10,
        cursor: 'pointer',
        ...style,
      }}
    >
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={onClick}
        style={{
          width: dims.w,
          transform: hovered
            ? `rotateY(${rotateY * 0.4}deg) rotateX(${rotateX * 0.4}deg) scale(1.03)`
            : `rotateY(${rotateY}deg) rotateX(${rotateX}deg)`,
          transformOrigin: 'center center',
          transition: 'transform 0.65s cubic-bezier(0.22,1,0.36,1)',
        }}
      >
        {/* Bezel / shell */}
        <div style={{
          background: '#07070f',
          border: `1px solid ${hovered ? color + '55' : color + '1a'}`,
          boxShadow: hovered
            ? `0 0 0 1px ${color}44, 0 32px 100px rgba(0,0,0,0.95), 0 0 70px ${color}0f`
            : `0 0 0 1px ${color}0c, 0 18px 70px rgba(0,0,0,0.85)`,
          transition: 'border-color 0.4s, box-shadow 0.4s',
          borderRadius: form === 'phone' ? '12px' : '3px',
          overflow: 'hidden',
        }}>
          {/* Chrome bar (only on monitor / tablet) */}
          {form !== 'phone' && (
            <div style={{
              height: '24px', background: '#03030a',
              borderBottom: '1px solid rgba(255,255,255,0.04)',
              display: 'flex', alignItems: 'center', padding: '0 9px', gap: '4px',
            }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#ff5f57', opacity: 0.7 }} />
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#febc2e', opacity: 0.7 }} />
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#28c840', opacity: 0.7 }} />
            </div>
          )}
          {/* Phone notch */}
          {form === 'phone' && (
            <div style={{
              height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <div style={{ width: '40px', height: '4px', borderRadius: '2px', background: 'rgba(255,255,255,0.06)' }} />
            </div>
          )}

          {/* Screen */}
          <div style={{
            padding: dims.padding, minHeight: dims.minH,
            background: `linear-gradient(140deg, #06060e 0%, #0b0b1c 100%)`,
            position: 'relative',
          }}>
            {/* Scanlines */}
            <div style={{
              position: 'absolute', inset: 0, pointerEvents: 'none',
              background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.07) 2px, rgba(0,0,0,0.07) 4px)',
            }} />
            {/* Screen glow */}
            <div style={{
              position: 'absolute', inset: 0, pointerEvents: 'none',
              background: `radial-gradient(ellipse at 30% 40%, ${color}08 0%, transparent 70%)`,
            }} />

            <div style={{ position: 'relative' }}>
              <p style={{ fontFamily: 'monospace', fontSize: '7px', letterSpacing: '0.38em', color: color + '80', marginBottom: '8px' }}>
                {projectNum} // PROJECT
              </p>
              <h3 style={{
                fontFamily: '"Helvetica Neue", Arial, sans-serif',
                fontSize: form === 'phone'
                  ? 'clamp(14px,2.5vw,20px)'
                  : 'clamp(18px,3vw,32px)',
                fontWeight: 800,
                color: 'rgba(255,255,255,0.95)',
                letterSpacing: '-0.02em',
                lineHeight: 1.05,
                marginBottom: '8px',
              }}>
                {title}
              </h3>
              <p style={{ fontFamily: 'monospace', fontSize: '7px', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.22)', marginBottom: '16px' }}>
                {sub}
              </p>

              {tag && (
                <span style={{
                  fontFamily: 'monospace', fontSize: '7px', letterSpacing: '0.18em',
                  color: color, border: `1px solid ${color}30`,
                  padding: '3px 8px', borderRadius: '2px', background: color + '0c',
                }}>
                  {tag}
                </span>
              )}

              <div style={{ marginTop: '14px' }}>
                <span style={{
                  fontFamily: 'monospace', fontSize: '7px', letterSpacing: '0.2em',
                  color: 'rgba(255,255,255,0.18)',
                }}>
                  {hovered ? '↗ INSPECT' : '·'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stand — only for monitor */}
        {form === 'monitor' && (
          <>
            <div style={{ width: '34%', height: '9px', background: '#040408', margin: '0 auto', borderBottom: '1px solid rgba(255,255,255,0.03)' }} />
            <div style={{ width: '20%', height: '3px', background: '#030306', margin: '0 auto', borderRadius: '2px' }} />
          </>
        )}
      </div>
    </div>
  );
};

// ─── AMBER REMNANTS ───────────────────────────────────────────────────────────
const AmberRemnants = () => (
  <>
    <div style={{ position: 'absolute', left: '6%', top: '38vh', width: '220px', height: '220px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(232,168,74,0.09) 0%, transparent 70%)', filter: 'blur(28px)', pointerEvents: 'none', zIndex: 1 }} />
    <div style={{ position: 'absolute', right: '7%', top: '94vh', width: '130px', height: '130px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(232,168,74,0.06) 0%, transparent 70%)', filter: 'blur(20px)', pointerEvents: 'none', zIndex: 1 }} />
  </>
);

// ─── VINYL FRAGMENT ───────────────────────────────────────────────────────────
const VinylFragment = () => (
  <div style={{ position: 'absolute', left: '-65px', top: '58vh', width: '190px', height: '190px', borderRadius: '50%', background: 'repeating-radial-gradient(circle, #0c0c18 0px, #0c0c18 2px, #17172a 3px, #0c0c18 5px)', border: '1px solid rgba(232,168,74,0.09)', boxShadow: '5px 0 40px rgba(232,168,74,0.04)', zIndex: 2, pointerEvents: 'none', opacity: 0.6 }}>
    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '26px', height: '26px', borderRadius: '50%', background: '#050510', border: '1px solid rgba(232,168,74,0.22)' }} />
  </div>
);

// ─── CENTRAL VOID ─────────────────────────────────────────────────────────────
const CentralVoid = () => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let id: number, t = 0;
    const loop = () => { t += 0.007; if (ref.current) ref.current.style.transform = `scale(${1 + Math.sin(t * 1.2) * 0.04})`; id = requestAnimationFrame(loop); };
    loop();
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div style={{ position: 'absolute', left: '40%', top: '65vh', transform: 'translateX(-50%)', zIndex: 4, pointerEvents: 'none' }}>
      <div ref={ref}>
        <div style={{ width: '90px', height: '90px', borderRadius: '50%', background: 'radial-gradient(circle, #000 20%, rgba(28,0,55,0.6) 60%, transparent 100%)', boxShadow: '0 0 0 1px rgba(130,0,190,0.18), 0 0 50px rgba(90,0,160,0.10)' }} />
      </div>
      <p style={{ fontFamily: 'monospace', fontSize: '7px', letterSpacing: '0.5em', color: 'rgba(130,0,190,0.28)', textAlign: 'center', marginTop: '7px', marginLeft: '-30px' }}>
        VOID
      </p>
    </div>
  );
};

// ─── CRT FRAGMENT ─────────────────────────────────────────────────────────────
const CRTFragment = () => (
  <div style={{ position: 'absolute', right: '1%', top: '78vh', perspective: '400px', zIndex: 3, pointerEvents: 'none', opacity: 0.38 }}>
    <div style={{ width: 'clamp(100px,14vw,170px)', height: 'clamp(75px,10vw,125px)', background: '#040409', border: '2px solid rgba(255,255,255,0.05)', transform: 'rotateY(26deg) rotateX(-5deg)', boxShadow: '0 0 28px rgba(0,0,0,0.9)', borderRadius: '2px', overflow: 'hidden', position: 'relative' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.12) 3px, rgba(0,0,0,0.12) 6px)' }} />
      {[35, 50, 42, 28, 55].map((w, i) => (
        <div key={i} style={{ position: 'absolute', top: `${20 + i * 14}%`, left: '10%', width: `${w}%`, height: '1px', background: `rgba(0,200,80,${0.12 + i * 0.02})` }} />
      ))}
    </div>
  </div>
);

// ─── GHOST FRAME — workspace growing ─────────────────────────────────────────
const GhostFrame = () => (
  <div style={{ position: 'absolute', left: 'clamp(5%, 8vw, 12%)', top: '118vh', width: 'clamp(180px,24vw,300px)', zIndex: 5 }}>
    <div style={{ border: '1px dashed rgba(255,255,255,0.07)', borderRadius: '3px', height: 'clamp(90px,13vh,160px)', background: 'rgba(255,255,255,0.006)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
      <span style={{ fontFamily: 'monospace', fontSize: '7px', letterSpacing: '0.32em', color: 'rgba(255,255,255,0.09)' }}>// BUILDING</span>
      {/* Corner marks */}
      {([[0,0],[0,1],[1,0],[1,1]] as const).map(([tb,lr],i) => (
        <div key={i} style={{ position:'absolute', top: tb?'auto':'0', bottom: tb?'0':'auto', left: lr?'auto':'0', right: lr?'0':'auto', width:8, height:8, borderTop: !tb?'1px solid rgba(0,255,225,0.12)':undefined, borderBottom: tb?'1px solid rgba(0,255,225,0.12)':undefined, borderLeft: !lr?'1px solid rgba(0,255,225,0.12)':undefined, borderRight: lr?'1px solid rgba(0,255,225,0.12)':undefined }} />
      ))}
    </div>
    <p style={{ fontFamily: 'monospace', fontSize: '7px', letterSpacing: '0.22em', color: 'rgba(255,255,255,0.06)', marginTop: '5px' }}>next artifact — in progress</p>
  </div>
);

// ─── MAIN EXPORT ──────────────────────────────────────────────────────────────
export const DigitalEnvironment: React.FC = () => {
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);

  return (
    <section style={{ position: 'relative', minHeight: '260vh', width: '100%', background: 'transparent', overflow: 'visible' }}>

      {/* Waveform — music as architecture */}
      <WaveformRibbon />

      {/* Cables connecting the world */}
      <CableCanvas />

      {/* Room remnants */}
      <AmberRemnants />
      <VinylFragment />

      {/* ── PROJECT 01 — THIS WEBSITE ────────────────────────────────────── */}
      {/* Primary artifact: large monitor, right side, prominent */}
      <Artifact
        style={{ position: 'absolute', right: 'clamp(3%, 5vw, 9%)', top: '26vh' }}
        form="monitor"
        rotateY={-9} rotateX={3}
        projectNum="01"
        title={"THIS\nWEBSITE"}
        sub="UI — UX — INTERACTION — SOUND"
        color="#00ffe1"
        tag="YOU ARE INSIDE IT"
        onClick={() => setActiveProjectId('1')}
      />

      {/* ── PROJECT 02 — TEAM SECTION ────────────────────────────────────── */}
      {/* Phone form factor, left side, midway — UI work */}
      <Artifact
        style={{ position: 'absolute', left: 'clamp(5%, 9vw, 14%)', top: '52vh' }}
        form="phone"
        rotateY={10} rotateX={-4}
        projectNum="02"
        title={"TEAM\nSECTION"}
        sub="UI / VISUAL DESIGN"
        color="#b400ff"
        tag="FIGMA"
        onClick={() => setActiveProjectId('3')}
      />

      {/* ── PROJECT 03 — EVENT DISCOVERY ─────────────────────────────────── */}
      {/* Tablet form factor, right-center, lower — UX research */}
      <Artifact
        style={{ position: 'absolute', right: 'clamp(8%, 12vw, 18%)', top: '82vh' }}
        form="tablet"
        rotateY={-12} rotateX={5}
        projectNum="03"
        title={"EVENT\nDISCOVERY"}
        sub="UX RESEARCH / WIREFRAMES"
        color="#e8a84a"
        tag="CASE STUDY"
        onClick={() => setActiveProjectId('2')}
      />

      {/* Central void — gravitational pull */}
      <CentralVoid />

      {/* Hardware fragments */}
      <CRTFragment />

      {/* Ghost frame — workspace growing */}
      <GhostFrame />

      {/* Case study modal — opens when artifact is clicked */}
      <ProjectArtifactViewer
        projectId={activeProjectId}
        onClose={() => setActiveProjectId(null)}
      />
    </section>
  );
};

export default DigitalEnvironment;
