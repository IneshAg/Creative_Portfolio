import React, { forwardRef } from "react";
import { ChaoticDigitalPlayer } from "./ChaoticDigitalPlayer";

interface DigitalWorldProps {
  activeRef: React.MutableRefObject<boolean>;
  opacity?: number;
  isPlaying?: boolean;
  onTogglePlay?: () => void;
}

// 03 — THE DIGITAL ABYSS (DOM UI Layer)
export const DigitalWorld = forwardRef<HTMLDivElement, DigitalWorldProps>(function DigitalWorld(
  { opacity = 1, isPlaying = false, onTogglePlay = () => {} },
  digitalRef
) {
  return (
    <div
      ref={digitalRef}
      className="digital-layer absolute inset-0 w-full h-full pointer-events-none"
      data-testid="digital-world"
      style={{
        opacity: opacity,
        zIndex: 30, // Above Room UI, below silence veil
      }}
    >
      {/* CHAOTIC DIGITAL MUSIC PLAYER */}
      <div 
        className="absolute" 
        style={{ 
          left: "clamp(1.5rem, 6vw, 5rem)", 
          top: "clamp(12rem, 30vh, 22rem)",
          pointerEvents: opacity > 0.5 ? "auto" : "none"
        }}
      >
        <ChaoticDigitalPlayer
          isPlaying={isPlaying}
          onTogglePlay={onTogglePlay}
        />
      </div>
    </div>
  );
});

export default DigitalWorld;
