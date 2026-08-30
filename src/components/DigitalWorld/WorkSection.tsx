import React, { useState, useRef, useEffect } from "react";
import { ProjectArtifactViewer } from "./ProjectArtifactViewer";



// Projects in display order — TEAM SECTION first (was 3), EVENT DISCOVERY second (was 2), THIS WEBSITE last
const PROJECTS = [
  {
    id: '3',
    num: '01',
    title: 'TEAM SECTION',
    sub: 'UI / Visual Design',
    tag: 'LIVE — FIGMA',
    color: '#b400ff',
  },
  {
    id: '2',
    num: '02',
    title: 'EVENT DISCOVERY',
    sub: 'UX Research / Wireframes',
    tag: 'CASE STUDY',
    color: '#00ffe1',
  },
  {
    id: '1',
    num: '03',
    title: 'THIS WEBSITE',
    sub: 'UI / UX / Interaction',
    tag: 'YOU ARE INSIDE IT',
    color: '#e8a84a',
  },
];

const ProjectCard = ({
  project,
  index,
  isActive,
  onClick,
}: {
  project: typeof PROJECTS[0];
  index: number;
  isActive: boolean;
  onClick: () => void;
}) => {
  const scale = isActive ? 1.0 : 0.94;
  const opacity = isActive ? 1 : 0.55;
  const glow = isActive
    ? `0 0 0 1px ${project.color}40, 0 24px 80px rgba(0,0,0,0.8), 0 0 40px ${project.color}18`
    : `0 0 0 1px ${project.color}10, 0 12px 40px rgba(0,0,0,0.6)`;

  return (
    <div
      style={{
        position: 'sticky',
        top: `${60 + index * 24}px`,
        zIndex: 10 + index,
        transition: 'transform 0.4s cubic-bezier(0.22,1,0.36,1), opacity 0.4s ease',
        transform: `scale(${scale})`,
        transformOrigin: 'center top',
        opacity,
        marginBottom: 0,
      }}
    >
      <div
        onClick={onClick}
        className="group cursor-pointer w-full max-w-3xl mx-auto bg-[#0d0d1a]/95 backdrop-blur-sm border border-white/8 rounded-2xl overflow-hidden"
        style={{ boxShadow: glow, transition: 'box-shadow 0.4s ease' }}
      >
        {/* Top accent line */}
        <div
          className="h-[1px] w-full transition-all duration-500"
          style={{
            background: isActive
              ? `linear-gradient(90deg, transparent, ${project.color}, transparent)`
              : `linear-gradient(90deg, transparent, ${project.color}40, transparent)`,
          }}
        />

        <div className="p-8 sm:p-10">
          {/* Header row */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <span
                className="font-mono text-[10px] tracking-[0.4em] font-bold"
                style={{ color: project.color }}
              >
                {project.num}
              </span>
              <span
                className="font-mono text-[9px] tracking-[0.3em] px-2.5 py-0.5 rounded border"
                style={{
                  color: project.color,
                  borderColor: `${project.color}40`,
                  background: `${project.color}10`,
                }}
              >
                {project.tag}
              </span>
            </div>
            <span className="font-mono text-[9px] tracking-widest text-stone-600 group-hover:text-stone-400 transition-colors">
              CLICK TO INSPECT →
            </span>
          </div>

          {/* Title */}
          <h3 className="font-grotesk font-bold text-3xl sm:text-4xl text-white tracking-tight mb-3">
            {project.title}
          </h3>

          {/* Sub-label */}
          <p className="font-mono text-[11px] tracking-[0.3em] text-stone-500 uppercase">
            {project.sub}
          </p>
        </div>

        {/* Bottom accent line */}
        <div
          className="h-[1px] w-full"
          style={{
            background: `linear-gradient(90deg, transparent, ${project.color}${isActive ? '60' : '20'}, transparent)`,
          }}
        />
      </div>
    </div>
  );
};

export const WorkSection: React.FC = () => {
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const onScroll = () => {
      const winH = window.innerHeight;
      const midY = winH * 0.45; // treat 45% from top as "focus zone"

      let bestIndex = 0;
      let bestDist = Infinity;

      cardRefs.current.forEach((el, i) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const cardMid = rect.top + rect.height / 2;
        const dist = Math.abs(cardMid - midY);
        if (dist < bestDist) {
          bestDist = dist;
          bestIndex = i;
        }
      });

      setActiveIndex(bestIndex);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section
      className="work-shell"
      data-testid="work-section"
      style={{
        minHeight: "240vh",
        background: "transparent",
        padding: "16vh clamp(1.25rem,6vw,5rem) 20vh",
        position: "relative",
      }}
    >
      {/* Header */}
      <div
        className="font-mono-sys"
        style={{
          position: "relative",
          fontSize: "0.6rem",
          letterSpacing: "0.34em",
          color: "rgba(0,255,225,0.55)",
          marginBottom: "10vh",
        }}
        data-testid="work-label"
      >
        SELECTED WORK — ARCHIVE 01
      </div>

      {/* Section title */}
      <div style={{ marginBottom: "8vh", position: "relative", zIndex: 2 }}>
        <h2
          className="font-grotesk font-bold"
          style={{
            fontSize: "clamp(2rem,5vw,3.5rem)",
            color: "white",
            letterSpacing: "-0.01em",
            lineHeight: 1.1,
          }}
        >
          Work
        </h2>
      </div>

      {/* Stacked project cards */}
      <div style={{ position: "relative" }}>
        {PROJECTS.map((project, i) => (
          <div
            key={project.id}
            ref={(el) => { cardRefs.current[i] = el; }}
          >
            <ProjectCard
              project={project}
              index={i}
              isActive={activeIndex === i}
              onClick={() => setActiveProjectId(project.id)}
            />
            {i < PROJECTS.length - 1 && (
              <div
                style={{
                  height: '1px',
                  background: 'rgba(255,255,255,0.04)',
                  margin: '0 auto',
                  maxWidth: '48rem',
                  position: 'relative',
                  zIndex: 5,
                }}
              />
            )}
          </div>
        ))}
      </div>

      <p
        className="font-mono-sys"
        style={{
          position: "relative",
          marginTop: "14vh",
          fontSize: "0.6rem",
          letterSpacing: "0.28em",
          color: "rgba(255,255,255,0.2)",
          maxWidth: 420,
          lineHeight: 2,
          zIndex: 3,
        }}
      >
        THE ARCHIVE IS YOUNG.<br />MORE WORK IN PROGRESS.
      </p>

      <ProjectArtifactViewer
        projectId={activeProjectId}
        onClose={() => setActiveProjectId(null)}
      />
    </section>
  );
};

export default WorkSection;
