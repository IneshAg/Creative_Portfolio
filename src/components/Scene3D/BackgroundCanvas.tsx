import React from 'react';
import { Canvas } from '@react-three/fiber';
import { RoomPlane } from './RoomPlane';
import { AbyssScene } from './AbyssScene';

interface BackgroundCanvasProps {
  isPlaying: boolean;
}

export const BackgroundCanvas: React.FC<BackgroundCanvasProps> = ({ isPlaying }) => {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 75 }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0, // Behind the DOM UI
        background: '#020204',
        pointerEvents: 'none', // Important: Let clicks pass through to the DOM (like the turntable hit-box)
      }}
    >
      <color attach="background" args={["#05050a"]} />
      <fog attach="fog" args={["#05050a", 15, 60]} />

      {/* The Digital Abyss (Background, Z = -10 to -50) */}
      <AbyssScene />

      {/* The Room Plane (Foreground, Z = 0) */}
      <RoomPlane isPlaying={isPlaying} />
    </Canvas>
  );
};
