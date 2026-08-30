import React from "react";

export const SvgDefs: React.FC = () => (
  <svg width="0" height="0" aria-hidden="true" style={{ position: "absolute", pointerEvents: "none" }}>
    <defs>
      <filter id="chroma-r">
        <feColorMatrix
          type="matrix"
          values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"
        />
      </filter>
      <filter id="chroma-b">
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0"
        />
      </filter>
      <filter id="roughen">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.9"
          numOctaves="2"
          result="n"
        />
        <feDisplacementMap in="SourceGraphic" in2="n" scale="3" />
      </filter>
    </defs>
  </svg>
);

export default SvgDefs;
