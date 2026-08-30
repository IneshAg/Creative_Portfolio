import React, { useState, useEffect } from 'react';
import { X, Sparkles, Layers, Volume2, Cpu, CheckCircle2, Layout, ExternalLink } from 'lucide-react';

interface ProjectArtifactViewerProps {
  projectId: string | null;
  onClose: () => void;
}

const PROJECTS_DATA: Record<string, any> = {
  '1': {
    id: '01',
    title: 'THIS WEBSITE',
    category: 'UI / UX / Interaction',
    hero: 'Explorable Digital World',
    description: 'A continuous narrative environment connecting an intimate 2 AM physical workspace with an infinite digital universe.',
    sections: [
      { id: 'narrative', label: 'Story & Philosophy', icon: Sparkles },
      { id: 'visuals', label: 'Pixel Physics & Shaders', icon: Layers },
      { id: 'audio', label: 'Web Audio Synthesizer', icon: Volume2 },
      { id: 'tech', label: '60 FPS Canvas Engine', icon: Cpu },
    ]
  },
  '2': {
    id: '02',
    title: 'EVENT DISCOVERY',
    category: 'UX Research / Wireframes',
    hero: 'User Personas & Flow Maps',
    description: 'Comprehensive wireframes and user personas exploring frictionless event discovery for a modern social platform.',
    sections: [
      { id: 'research', label: 'User Personas', icon: Sparkles },
      { id: 'wireframes', label: 'App Wireframes', icon: Layers },
      { id: 'prototype', label: 'Figma Prototype', icon: Layout }
    ],
    figmaLink: 'https://www.figma.com/design/c9HhGi3xHVNUuuxoP5z5nv/Event-Wireframe?node-id=39-501&t=hFN4KrAjlWgiUvXw-1'
  },
  '3': {
    id: '03',
    title: 'TEAM SECTION',
    category: 'UI / Visual Design',
    hero: 'Modern Team Component',
    description: 'Clean, accessible, and high-fidelity UI designs for a scalable corporate team section.',
    sections: [
      { id: 'visuals', label: 'Visual Language', icon: Sparkles },
      { id: 'components', label: 'UI Components', icon: Layers },
      { id: 'prototype', label: 'Figma File', icon: Layout }
    ],
    figmaLink: 'https://www.figma.com/design/u20upfeNZb3ouqBJ3kpiuC/Untitled?node-id=0-1&t=r3dQLsrzrqO0BXqB-1'
  }
};

export const ProjectArtifactViewer: React.FC<ProjectArtifactViewerProps> = ({ projectId, onClose }) => {
  const [section, setSection] = useState<string>('');

  useEffect(() => {
    if (projectId && PROJECTS_DATA[projectId]) {
      setSection(PROJECTS_DATA[projectId].sections[0].id);
    }
  }, [projectId]);

  if (!projectId || !PROJECTS_DATA[projectId]) return null;
  const project = PROJECTS_DATA[projectId];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-xl animate-fadeIn">
      {/* Background click */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* In-World Floating Display Shell */}
      <div className="relative w-full max-w-4xl bg-[#0e0e1a] border border-[#00ffe1]/40 rounded-2xl p-6 sm:p-8 shadow-[0_0_80px_rgba(0,255,225,0.25)] flex flex-col max-h-[88vh] z-10 overflow-hidden font-grotesk">
        
        {/* Top bar */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
          <div className="flex items-center gap-3">
            <span className="text-xs font-pixel text-[#00ffe1]">
              ARTIFACT {project.id} // {project.title}
            </span>
            <span className="text-xs font-mono text-stone-400">
              {project.category}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-stone-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Hero Title */}
        <div className="mb-6">
          <h2 className="font-bold text-2xl sm:text-3xl text-white tracking-tight">
            {project.hero}
          </h2>
          <p className="text-stone-300 text-sm sm:text-base mt-1.5 leading-relaxed max-w-2xl">
            {project.description}
          </p>

          {/* Section Selector */}
          <div className="flex flex-wrap gap-2 mt-5">
            {project.sections.map((s: any) => {
              const Icon = s.icon;
              const isActive = section === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => setSection(s.id)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs transition-all ${
                    isActive
                      ? 'bg-[#00ffe1] text-[#0a0a12] font-semibold shadow-[0_0_15px_rgba(0,255,225,0.4)]'
                      : 'bg-white/5 text-stone-300 hover:bg-white/10 hover:text-white border border-white/5'
                  }`}
                >
                  <Icon size={13} />
                  <span>{s.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto space-y-4 text-stone-300 text-sm leading-relaxed pr-2">
          
          {/* Project 1: THIS WEBSITE */}
          {projectId === '1' && section === 'narrative' && (
            <div className="space-y-4">
              <p>Conventional design portfolios reduce work into isolated mockup cards. This project treats the portfolio itself as the primary interactive design artifact.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 font-mono text-xs">
                <div className="p-3.5 rounded-xl bg-black/40 border border-[#e8a84a]/30">
                  <span className="text-[#e8a84a] font-bold block mb-1">01. The Cozy Room (2 AM)</span>
                  <p className="text-stone-400">Warm amber glow, personal objects, acoustic guitar, and the spinning vinyl turntable.</p>
                </div>
                <div className="p-3.5 rounded-xl bg-black/40 border border-[#00ffe1]/30">
                  <span className="text-[#00ffe1] font-bold block mb-1">02. The Infinite Digital World</span>
                  <p className="text-stone-400">Floating CRT screens, generative geometry, and interface surfaces suspended in space.</p>
                </div>
              </div>
            </div>
          )}
          {projectId === '1' && section === 'visuals' && (
            <div className="space-y-3">
              <p>The transition is powered by a custom scroll-driven pipeline:</p>
              <ul className="space-y-2 text-xs font-mono text-stone-300">
                <li className="flex items-start gap-2"><CheckCircle2 size={14} className="text-[#00ffe1] mt-0.5 flex-shrink-0" /><span><strong>Phase 01:</strong> Sub-pixel scanlines and subtle cyan contamination.</span></li>
                <li className="flex items-start gap-2"><CheckCircle2 size={14} className="text-[#00ffe1] mt-0.5 flex-shrink-0" /><span><strong>Phase 02:</strong> Dynamic horizontal CRT tearing and chromatic bleeding.</span></li>
                <li className="flex items-start gap-2"><CheckCircle2 size={14} className="text-[#00ffe1] mt-0.5 flex-shrink-0" /><span><strong>Phase 03:</strong> Physical dissolution into falling shards.</span></li>
              </ul>
            </div>
          )}
          {projectId === '1' && section === 'audio' && (
            <div className="space-y-3">
              <p>The soundtrack is processed procedurally in real-time with Web Audio:</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs pt-1">
                <div className="p-3 rounded-lg bg-black/40 border border-white/10"><span className="text-[#e8a84a] font-bold block mb-1">Crossfade</span><p className="text-stone-400 text-[11px]">Seamless blending between tracks based on scroll depth.</p></div>
                <div className="p-3 rounded-lg bg-black/40 border border-white/10"><span className="text-[#00ffe1] font-bold block mb-1">Signal Rupture</span><p className="text-stone-400 text-[11px]">Aggressive clipping and Ryoji Ikeda data noise burst.</p></div>
                <div className="p-3 rounded-lg bg-black/40 border border-white/10"><span className="text-[#b400ff] font-bold block mb-1">Waveform FFT</span><p className="text-stone-400 text-[11px]">Real-time frequency response visualizer linking the worlds.</p></div>
              </div>
            </div>
          )}
          {projectId === '1' && section === 'tech' && (
            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-black/50 border border-white/10 font-mono text-xs space-y-1.5">
                <div className="flex justify-between"><span className="text-stone-400">Rendering:</span><span className="text-emerald-400">Hardware-Accelerated HTML5 Canvas</span></div>
                <div className="flex justify-between"><span className="text-stone-400">Scroll Architecture:</span><span className="text-[#00ffe1]">Lenis Smooth Scroll + GSAP ScrollTrigger</span></div>
                <div className="flex justify-between"><span className="text-stone-400">3D Physics:</span><span className="text-[#b400ff]">Three.js Custom ShaderMaterials</span></div>
              </div>
            </div>
          )}

          {/* Project 2: EVENT DISCOVERY */}
          {projectId === '2' && section === 'research' && (
            <div className="space-y-4 animate-fadeIn">
              <p>Thorough user personas were developed to understand the pain points of event discovery platforms. Key insights included overwhelming event lists, lack of social context, and difficult filtering.</p>
              <div className="p-4 rounded-xl bg-black/40 border border-[#00ffe1]/30 font-mono text-xs text-stone-300">
                &gt; GOAL: Reduce friction in finding relevant local events by mapping discovery paths for different archetype users (e.g. The Planner vs The Spontaneous Explorer).
              </div>
            </div>
          )}
          {projectId === '2' && section === 'wireframes' && (
            <div className="space-y-4 animate-fadeIn">
              <p>Low-to-mid fidelity wireframes mapping out the core user journey from landing to ticket conversion.</p>
              <ul className="space-y-2 text-xs font-mono text-stone-300">
                <li className="flex items-start gap-2"><CheckCircle2 size={14} className="text-[#00ffe1] mt-0.5 flex-shrink-0" /><span>Discovery Feed Architecture</span></li>
                <li className="flex items-start gap-2"><CheckCircle2 size={14} className="text-[#00ffe1] mt-0.5 flex-shrink-0" /><span>Smart Filter Systems</span></li>
                <li className="flex items-start gap-2"><CheckCircle2 size={14} className="text-[#00ffe1] mt-0.5 flex-shrink-0" /><span>Event Details Layout &amp; Hierarchy</span></li>
              </ul>
            </div>
          )}

          {/* Project 3: TEAM SECTION */}
          {projectId === '3' && section === 'visuals' && (
            <div className="space-y-4 animate-fadeIn">
              <p>A corporate &quot;Meet the Team&quot; section redesigned for modern aesthetics, utilizing generous white space, crisp typography, and subtle micro-interactions.</p>
            </div>
          )}
          {projectId === '3' && section === 'components' && (
            <div className="space-y-4 animate-fadeIn">
              <p>The design system breaks down the team section into reusable, scalable components for future expansion.</p>
              <ul className="space-y-2 text-xs font-mono text-stone-300">
                <li className="flex items-start gap-2"><CheckCircle2 size={14} className="text-[#00ffe1] mt-0.5 flex-shrink-0" /><span>Profile Cards with Hover States</span></li>
                <li className="flex items-start gap-2"><CheckCircle2 size={14} className="text-[#00ffe1] mt-0.5 flex-shrink-0" /><span>Responsive Grid Systems</span></li>
                <li className="flex items-start gap-2"><CheckCircle2 size={14} className="text-[#00ffe1] mt-0.5 flex-shrink-0" /><span>Accessible Color Contrast Profiles</span></li>
              </ul>
            </div>
          )}

          {/* FIGMA EXTERNAL LINK (For Projects 2 & 3) */}
          {(projectId === '2' || projectId === '3') && section === 'prototype' && (
            <div className="space-y-4 flex flex-col items-center justify-center py-8 animate-fadeIn">
              <div className="p-4 rounded-full bg-[#2C2D33] mb-4 shadow-lg shadow-black/50">
                <Layout size={36} className="text-[#00ffe1]" />
              </div>
              <p className="text-center text-stone-300 mb-4 max-w-md">
                View the complete {projectId === '2' ? 'wireframes and personas' : 'visual designs'} directly in Figma.
              </p>
              <a 
                href={project.figmaLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 rounded-lg bg-[#00ffe1] text-[#0a0a12] font-bold transition-all hover:scale-105 hover:bg-white hover:text-black"
              >
                Open Figma File <ExternalLink size={16} />
              </a>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-between mt-4">
          <span className="text-xs font-mono text-stone-400">
            INESH AGARWAL // 2026
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#00ffe1] text-[#0a0a12] font-semibold text-xs transition-colors hover:bg-[#00e0c5]"
          >
            Close Viewer
          </button>
        </div>
      </div>
    </div>
  );
};
