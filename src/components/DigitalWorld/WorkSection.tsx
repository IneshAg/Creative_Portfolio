import React, { useState } from "react";
import { motion } from "framer-motion";
import { ProjectArtifactViewer } from "./ProjectArtifactViewer";

const MARQUEE = "UI / UX / INTERACTION — STORY — MOTION — SPACE — SYSTEMS — EXPERIMENT — ";

export const WorkSection: React.FC = () => {
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);

  return (
    <section
      className="work-shell"
      data-testid="work-section"
      style={{
        minHeight: "190vh",
        background: "transparent",
        padding: "16vh clamp(1.25rem,6vw,5rem) 12vh",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* a cable crossing the section */}
      <svg
        aria-hidden="true"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
        viewBox="0 0 1600 1800"
        preserveAspectRatio="none"
      >
        <path d="M -60 300 C 400 120, 900 560, 1660 380" fill="none" stroke="#101018" strokeWidth="30" strokeLinecap="round" />
        <path d="M -60 300 C 400 120, 900 560, 1660 380" fill="none" stroke="rgba(0,255,225,0.16)" strokeWidth="3" />
        <path d="M 1400 -40 C 1200 500, 1500 1100, 1150 1840" fill="none" stroke="#0d0d15" strokeWidth="22" strokeLinecap="round" />
      </svg>

      {/* editorial marquee */}
      <div
        style={{
          position: "relative",
          overflow: "hidden",
          borderTop: "1px solid rgba(0,255,225,0.14)",
          borderBottom: "1px solid rgba(0,255,225,0.14)",
          padding: "0.9rem 0",
          marginBottom: "14vh",
          background: "rgba(10,10,18,0.55)",
        }}
        aria-hidden="true"
      >
        <div
          className="marquee-track font-mono-sys"
          style={{ fontSize: "0.66rem", letterSpacing: "0.4em", color: "rgba(0,255,225,0.4)", whiteSpace: "nowrap" }}
        >
          <span style={{ paddingRight: "2rem" }}>{MARQUEE.repeat(3)}</span>
          <span style={{ paddingRight: "2rem" }}>{MARQUEE.repeat(3)}</span>
        </div>
      </div>

      <div
        className="font-mono-sys"
        style={{ position: "relative", fontSize: "0.6rem", letterSpacing: "0.34em", color: "rgba(0,255,225,0.55)", marginBottom: "7vh" }}
        data-testid="work-label"
      >
        SELECTED WORK — ARCHIVE 01
      </div>

      {/* PROJECT_01 — a large monitor, embedded in the environment */}
      <motion.div
        initial={{ opacity: 0, y: 80, rotate: -2.5 }}
        whileInView={{ opacity: 1, y: 0, rotate: -2.5 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        style={{ position: "relative", maxWidth: 920, zIndex: 3 }}
      >
        <div
          className="artifact-monitor cursor-pointer"
          data-testid="project-this-website"
          onClick={() => setActiveProjectId('1')}
          title="Click screen to inspect case study"
        >
          <div className="artifact-bezel">
            <div className="artifact-screen">
              <div
                className="font-mono-sys"
                style={{
                  fontSize: "0.58rem",
                  letterSpacing: "0.3em",
                  color: "rgba(0,255,225,0.7)",
                  display: "flex",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: 8,
                }}
              >
                <span>PROJECT_01</span>
                <span style={{ color: "rgba(255,255,255,0.4)" }}>STATUS: LIVE — YOU ARE INSIDE IT</span>
              </div>
              <h3
                style={{
                  marginTop: "1.4rem",
                  fontSize: "clamp(1.7rem,3.6vw,2.8rem)",
                  fontWeight: 600,
                  color: "#fff",
                  letterSpacing: "0.02em",
                }}
              >
                THIS WEBSITE
              </h3>
              <div
                className="font-mono-sys"
                style={{ marginTop: 8, fontSize: "0.62rem", letterSpacing: "0.26em", color: "rgba(180,0,255,0.85)" }}
              >
                UI / UX / INTERACTION
              </div>
              <p
                style={{
                  marginTop: "1.3rem",
                  color: "rgba(255,255,255,0.62)",
                  fontSize: "0.95rem",
                  lineHeight: 1.75,
                  maxWidth: 500,
                }}
              >
                A portfolio designed as an explorable digital world. One continuous
                environment — a room, a rupture, a universe, and a way back.
                The website is the first case study.
              </p>
              {/* screen-in-screen: the artifact contains the world it describes */}
              <div className="artifact-inner-screen" aria-hidden="true">
                <div className="artifact-inner-room" />
                <span className="crt-cursor" style={{ position: "absolute", right: 10, bottom: 8 }} />
              </div>
            </div>
          </div>
          <div className="artifact-stand" />
        </div>
      </motion.div>

      {/* PROJECT_02 — a smaller tilted CRT, still being built */}
      <motion.div
        initial={{ opacity: 0, y: 60, rotate: 4 }}
        whileInView={{ opacity: 1, y: 0, rotate: 4 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 1, delay: 0.15 }}
        style={{ position: "relative", width: "min(400px, 82vw)", marginLeft: "auto", marginTop: "-6vh", zIndex: 4 }}
      >
        <div className="artifact-monitor small cursor-pointer hover:scale-[1.02] transition-transform duration-500" data-testid="project-02" onClick={() => setActiveProjectId('2')} title="Click screen to inspect case study">
          <div className="artifact-bezel">
            <div className="artifact-screen dim">
              <div className="font-mono-sys" style={{ fontSize: "0.58rem", letterSpacing: "0.3em", color: "rgba(255,255,255,0.45)" }}>
                PROJECT_02
              </div>
              <div
                className="font-mono-sys"
                style={{ marginTop: "1rem", fontSize: "0.72rem", letterSpacing: "0.22em", color: "rgba(0,255,225,0.75)" }}
              >
                EVENT DISCOVERY
                <span style={{ fontSize: '0.5rem', color: 'rgba(255,255,255,0.4)', display: 'block', marginTop: '6px' }}>UX RESEARCH / WIREFRAMES</span>
              </div>
              <div className="progress-track" style={{ marginTop: "1.2rem" }}>
                <div className="progress-fill" />
              </div>
              <div className="artifact-scan" aria-hidden="true" />
            </div>
          </div>
          <div className="artifact-stand short" />
        </div>
      </motion.div>

      {/* PROJECT_03 — powered off, hanging in the dark */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 1.4 }}
        style={{ position: "relative", width: "min(320px, 70vw)", marginTop: "10vh", marginLeft: "8%", transform: "rotate(-6deg)", zIndex: 2 }}
      >
        <div className="artifact-monitor cursor-pointer hover:scale-[1.02] transition-transform duration-500" data-testid="project-03" onClick={() => setActiveProjectId('3')} title="Click screen to inspect case study">
          <div className="artifact-bezel">
            <div className="artifact-screen dim">
              <div className="font-mono-sys" style={{ fontSize: "0.56rem", letterSpacing: "0.3em", color: "rgba(255,255,255,0.22)" }}>
                PROJECT_03
              </div>
              <div
                className="font-mono-sys"
                style={{ marginTop: "0.9rem", fontSize: "0.68rem", letterSpacing: "0.22em", color: "rgba(0,255,225,0.75)" }}
              >
                TEAM SECTION
                <span style={{ fontSize: '0.5rem', color: 'rgba(255,255,255,0.4)', display: 'block', marginTop: '6px' }}>UI / VISUAL DESIGN</span>
              </div>
            </div>
          </div>
          <div className="artifact-stand short" />
        </div>
      </motion.div>

      <p
        className="font-mono-sys"
        style={{
          position: "relative",
          marginTop: "12vh",
          fontSize: "0.6rem",
          letterSpacing: "0.28em",
          color: "rgba(255,255,255,0.3)",
          maxWidth: 420,
          lineHeight: 2,
          zIndex: 3,
        }}
      >
        THE ARCHIVE IS YOUNG.<br />THE WORKSPACE IS NOT EMPTY —<br />IT IS UNDER CONSTRUCTION.
      </p>

      {/* In-World Project Artifact Viewer Modal */}
      <ProjectArtifactViewer
        projectId={activeProjectId}
        onClose={() => setActiveProjectId(null)}
      />
    </section>
  );
};

export default WorkSection;
