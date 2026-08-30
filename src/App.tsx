import { useState, useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SvgDefs } from './components/SvgDefs';
import { RoomScene } from './components/RoomWorld/RoomScene';
import { WorldTransition } from './components/CorruptionTransition/WorldTransition';
import { DigitalWorld } from './components/DigitalWorld/DigitalWorld';
import { DigitalEnvironment, HardwareDebrisField } from './components/DigitalWorld/DigitalEnvironment';
import { ReturnPortal } from './components/ReturnWorld/ReturnPortal';
import { Navigation } from './components/Navigation';
import { audioManager } from './audio/AudioManager';
import { BackgroundCanvas } from './components/Scene3D/BackgroundCanvas';
import { scrollState } from './store/scrollStore';
import { ChapterMarker } from './components/ChapterMarker';

gsap.registerPlugin(ScrollTrigger);

export function App() {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [domProgress, setDomProgress] = useState<number>(0);
  const [isReturning, setIsReturning] = useState<boolean>(false);
  
  const lenisRef = useRef<Lenis | null>(null);

  // Initialize Lenis smooth scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
    });
    lenisRef.current = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Sync Lenis with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove((time) => lenis.raf(time * 1000));
    };
  }, []);

  // Set up the authoritative GSAP ScrollTrigger timeline
  useEffect(() => {
    const st = ScrollTrigger.create({
      trigger: '.scene-pin-container',
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => {
        // Authoritative progress value (0 to 1) for the unified WebGL / Audio transition
        const p = self.progress;
        scrollState.progress = p;
        setDomProgress(p);
        audioManager.applyCorruptionState(p);
      }
    });

    return () => {
      st.kill();
    };
  }, []);

  // Audio trigger
  const handleToggleAudio = async () => {
    if (!isPlaying) {
      const started = await audioManager.start();
      if (started) setIsPlaying(true);
    } else {
      audioManager.pause();
      setIsPlaying(false);
    }
  };

  const handleToggleMute = () => {
    const next = audioManager.toggleMute();
    setIsMuted(next);
  };

  const handleReturnHome = () => {
    if (isReturning) return;
    setIsReturning(true);

    // Reset audio state
    audioManager.applyCorruptionState(0);
    if (!isPlaying) {
      audioManager.start().then(() => setIsPlaying(true));
    }

    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, {
        duration: 1.8,
        onComplete: () => setIsReturning(false),
      });
    }
  };

  const handleJumpToRoom = () => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { duration: 1.2 });
    }
  };

  // The Digital World UI opacity (fades in late in the transition)
  const digitalWorldOpacity = Math.min(1, Math.max(0, (domProgress - 0.7) * 3.3));

  return (
    <div className="app-root relative w-full bg-[#020204] min-h-screen">
      <SvgDefs />

      {/* ============================================================
          GLOBAL WEBGL CANVAS (The Room + The Abyss)
          ============================================================ */}
      <BackgroundCanvas isPlaying={isPlaying} />

      <Navigation
        isPlaying={isPlaying}
        isMuted={isMuted}
        onToggleAudio={handleToggleAudio}
        onToggleMute={handleToggleMute}
        onJumpToRoom={handleJumpToRoom}
      />

      {/* ============================================================
          PINNED SCENE DOM (UI Overlays only)
          ============================================================ */}
      <div className="scene-pin-container relative h-[320vh] w-full">
        <div className="scene-pin sticky top-0 h-screen w-full overflow-hidden pointer-events-none">
          {/* Room DOM UI (Turntable hitbox, Typography) */}
          <RoomScene
            isPlaying={isPlaying}
            onToggleAudio={handleToggleAudio}
            corruptionProgress={domProgress}
          />

          {/* World Transition Phase Status UI */}
          <WorldTransition progress={domProgress} />

          {/* Digital World DOM UI (Player widget) */}
          <DigitalWorld
            activeRef={{ current: true } as any}
            opacity={digitalWorldOpacity}
            isPlaying={isPlaying}
            onTogglePlay={handleToggleAudio}
          />
        </div>
      </div>

      {/* ============================================================
          GLOBAL CHAOS: HARDWARE DEBRIS SPANNING ENTIRE PAGE
          ============================================================ */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', pointerEvents: 'none', zIndex: 25 }}>
        <HardwareDebrisField count={70} heightSpread={580} startY={80} zIndex={25} />
      </div>

      {/* ============================================================
          DIGITAL FLOW: PHYSICAL WORK ARTIFACTS & RETURN WINDOW
          ============================================================ */}
      <main className="digital-flow relative z-30">
        <DigitalEnvironment />
        <ReturnPortal onReturnHome={handleReturnHome} isReturning={isReturning} />
      </main>

      <ChapterMarker progress={domProgress} />

      {isReturning && (
        <div className="return-veil opacity-100 transition-opacity duration-1000 z-50 pointer-events-none" />
      )}
    </div>
  );
}

export default App;
