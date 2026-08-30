import { useRef, useMemo, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { scrollState } from '../../store/scrollStore';

// ─── 1. BRAIN WAVE RIBBONS ─────────────────────────────────────────────────────
// EEG-style sinusoidal ribbons that pulse and distort like brain activity
const BrainWaveRibbons = () => {
  const groupRef = useRef<THREE.Group>(null);
  const ribbonCount = 18;

  const ribbons = useMemo(() => {
    return [...Array(ribbonCount)].map((_, i) => {
      const geometry = new THREE.BufferGeometry();
      const segments = 200;
      const positions = new Float32Array(segments * 3 * 2); // tube ribbon = 2 verts per segment
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setDrawRange(0, segments * 2);

      const freq1 = 0.8 + Math.random() * 2.5;
      const freq2 = 0.3 + Math.random() * 1.2;
      const phase = Math.random() * Math.PI * 2;
      const yOffset = (i / ribbonCount - 0.5) * 35;
      const xSpread = 45 + Math.random() * 20;
      const amplitude = 1.5 + Math.random() * 4;
      const zDepth = -25 - Math.random() * 25;

      const colors = [
        '#ff003c', '#00ffe1', '#7a3cff', '#ff6b00',
        '#00ff88', '#ff00ff', '#0088ff', '#ffff00'
      ];
      const color = new THREE.Color(colors[i % colors.length]);

      return { geometry, freq1, freq2, phase, yOffset, xSpread, amplitude, zDepth, color, segments };
    });
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const progress = scrollState.progress;
    const intensity = Math.max(0, (progress - 0.55) / 0.45); // ramps in as scene appears

    ribbons.forEach((ribbon) => {
      const positions = ribbon.geometry.attributes.position.array as Float32Array;
      const halfWidth = 0.15 + intensity * 0.3;

      for (let s = 0; s < ribbon.segments; s++) {
        const xNorm = (s / ribbon.segments - 0.5);
        const x = xNorm * ribbon.xSpread;
        // Layered sine waves — like EEG brainwave signal
        const y = ribbon.yOffset
          + Math.sin(x * ribbon.freq1 + t * 1.4 + ribbon.phase) * ribbon.amplitude
          + Math.sin(x * ribbon.freq2 * 3.0 + t * 2.1) * ribbon.amplitude * 0.4
          + Math.sin(x * 8.0 + t * 5.0) * 0.4 * intensity // high-freq glitch bursts
          + (Math.random() - 0.5) * 0.15 * intensity; // noise jitter
        const z = ribbon.zDepth + Math.cos(x * 0.3 + t * 0.5) * 5;

        // Two verts per segment = ribbon width
        const idx = s * 6;
        positions[idx + 0] = x; positions[idx + 1] = y - halfWidth; positions[idx + 2] = z;
        positions[idx + 3] = x; positions[idx + 4] = y + halfWidth; positions[idx + 5] = z;
      }
      ribbon.geometry.attributes.position.needsUpdate = true;
      ribbon.geometry.computeBoundingSphere();
    });
  });

  return (
    <group ref={groupRef}>
      {ribbons.map((ribbon, i) => (
        <lineSegments key={i} geometry={ribbon.geometry}>
          <lineBasicMaterial
            color={ribbon.color}
            transparent
            opacity={0.50}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </lineSegments>
      ))}
    </group>
  );
};

// ─── 2. CHROMATIC VORTEX FUNNEL ────────────────────────────────────────────────
// A spiraling funnel that pulls the viewer in — like the black hole/void in the refs
const ChromaticVortex = () => {
  const groupRef = useRef<THREE.Group>(null);

  const rings = useMemo(() => {
    return [...Array(40)].map((_, i) => {
      const t = i / 40;
      const radius = 2 + t * 38;
      const z = -10 - t * 50;
      const segments = Math.floor(32 + t * 80);
      const colors = ['#ff003c', '#ff6b00', '#ffff00', '#00ff88', '#00ffe1', '#0088ff', '#7a3cff', '#ff00ff'];
      const color = colors[i % colors.length];
      return { radius, z, segments, color, t };
    });
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.z = t * 0.12;
      // Pulse the whole vortex
      const pulse = 1.0 + Math.sin(t * 2.0) * 0.06;
      groupRef.current.scale.setScalar(pulse);
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {rings.map((ring, i) => (
        <mesh key={i} position={[0, 0, ring.z]} rotation={[Math.PI / 2, 0, (i * 0.18)]}>
          <torusGeometry args={[ring.radius, 0.04 + ring.t * 0.08, 3, ring.segments]} />
          <meshBasicMaterial
            color={ring.color}
            transparent
            opacity={0.09 + ring.t * 0.14}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
};

// ─── 3. PSYCHEDELIC PARTICLE CLOUD ─────────────────────────────────────────────
// Thousands of glitch-colored particles swirling in a brain-shaped volume
const PsychedelicCloud = () => {
  const meshRef = useRef<THREE.Points>(null);

  const { positions, colors } = useMemo(() => {
    const count = 3500;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const palette = [
      [1.0, 0.0, 0.24],  // crimson
      [0.0, 1.0, 0.88],  // cyan
      [0.48, 0.24, 1.0], // violet
      [1.0, 0.42, 0.0],  // orange
      [0.0, 1.0, 0.53],  // green
      [1.0, 0.0, 1.0],   // magenta
    ];

    for (let i = 0; i < count; i++) {
      // Brain-shaped distribution: prolate spheroid with noise
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);
      const r = 8 + Math.random() * 28;
      const hemisphereY = Math.sin(phi) * Math.cos(theta) * 0.7; // flatten into lobe shape

      positions[i * 3 + 0] = r * Math.sin(phi) * Math.cos(theta) * (0.9 + Math.random() * 0.4);
      positions[i * 3 + 1] = r * hemisphereY * (0.8 + Math.random() * 0.5) + (Math.random() - 0.5) * 6;
      positions[i * 3 + 2] = r * Math.cos(phi) * 0.65 - 35;

      const c = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 3 + 0] = c[0];
      colors[i * 3 + 1] = c[1];
      colors[i * 3 + 2] = c[2];
    }

    return { positions, colors };
  }, []);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    const posArray = meshRef.current.geometry.attributes.position.array as Float32Array;

    // Animate particles — slow swirl + occasional glitch spike
    for (let i = 0; i < posArray.length / 3; i++) {
      const ox = positions[i * 3 + 0];
      const oy = positions[i * 3 + 1];
      const oz = positions[i * 3 + 2] + 35;

      const angle = t * 0.08 + i * 0.001;
      posArray[i * 3 + 0] = ox * Math.cos(angle) - oz * Math.sin(angle) * 0.05;
      posArray[i * 3 + 1] = oy + Math.sin(t * 0.4 + i * 0.05) * 0.3;
      posArray[i * 3 + 2] = positions[i * 3 + 2];
    }
    meshRef.current.geometry.attributes.position.needsUpdate = true;
  });

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    return geo;
  }, [positions, colors]);

  return (
    <points ref={meshRef} geometry={geometry}>
      <pointsMaterial
        size={0.20}
        vertexColors
        transparent
        opacity={0.65}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
};

// ─── 4. NEURAL SYNAPSE LINES ───────────────────────────────────────────────────
// Glowing connection lines between random points — like neural pathways firing
const NeuralSynapses = () => {
  const linesRef = useRef<THREE.LineSegments>(null);

  const { geometry } = useMemo(() => {
    const nodeCount = 60;
    const maxConnections = 120;
    const nodePositions: THREE.Vector3[] = [];

    for (let i = 0; i < nodeCount; i++) {
      nodePositions.push(new THREE.Vector3(
        (Math.random() - 0.5) * 60,
        (Math.random() - 0.5) * 40,
        -20 - Math.random() * 40
      ));
    }

    const linePositions: number[] = [];
    let connections = 0;

    for (let i = 0; i < nodeCount && connections < maxConnections; i++) {
      for (let j = i + 1; j < nodeCount && connections < maxConnections; j++) {
        const dist = nodePositions[i].distanceTo(nodePositions[j]);
        if (dist < 18) {
          linePositions.push(nodePositions[i].x, nodePositions[i].y, nodePositions[i].z);
          linePositions.push(nodePositions[j].x, nodePositions[j].y, nodePositions[j].z);
          connections++;
        }
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(linePositions), 3));
    return { geometry: geo, nodePositions };
  }, []);

  useFrame(({ clock }) => {
    if (!linesRef.current) return;
    const t = clock.getElapsedTime();
    // Pulse opacity to simulate synaptic firing
    const mat = linesRef.current.material as THREE.LineBasicMaterial;
    mat.opacity = 0.06 + Math.abs(Math.sin(t * 1.5)) * 0.20;
  });

  return (
    <lineSegments ref={linesRef} geometry={geometry}>
      <lineBasicMaterial
        color="#00ffe1"
        transparent
        opacity={0.15}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </lineSegments>
  );
};

// ─── 5. THE ORIGINAL CORE + MONOLITHS ─────────────────────────────────────────
const InsaneCore = () => {
  const coreRef = useRef<THREE.Mesh>(null);
  const shellRef = useRef<THREE.Mesh>(null);
  const ringsRef = useRef<THREE.Group>(null);
  
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (coreRef.current && shellRef.current) {
      const glitchScale = 1.0 + Math.pow(Math.sin(t * 24.0), 4) * 0.3 + Math.cos(t * 7.0) * 0.2;
      coreRef.current.scale.setScalar(glitchScale);
      coreRef.current.rotation.x = t * 2.5;
      coreRef.current.rotation.y = t * 1.8;
      shellRef.current.scale.setScalar(glitchScale * 1.2);
      shellRef.current.rotation.x = -t * 2.0;
      shellRef.current.rotation.z = t * 1.5;
    }
    if (ringsRef.current) {
      ringsRef.current.rotation.x = t * -0.5;
      ringsRef.current.rotation.y = t * 0.8;
      ringsRef.current.children.forEach((child, i) => {
        child.rotation.x += (Math.sin(t * 5.0 + i) > 0 ? 0.05 : -0.05);
        child.rotation.y += Math.cos(t * 3.5 - i) * 0.1;
      });
    }
  });

  return (
    <group position={[0, 0, -35]}>
      <mesh ref={coreRef}>
        <octahedronGeometry args={[8, 2]} />
        <meshStandardMaterial color="#000000" roughness={0.1} metalness={1.0} />
      </mesh>
      <mesh ref={shellRef}>
        <icosahedronGeometry args={[8.5, 1]} />
        <meshBasicMaterial color="#ff003c" wireframe transparent opacity={0.6} blending={THREE.AdditiveBlending} />
      </mesh>
      <group ref={ringsRef}>
        {[...Array(12)].map((_, i) => (
          <mesh key={i} rotation={[Math.random() * Math.PI, Math.random() * Math.PI, 0]}>
            <torusGeometry args={[12 + i * 2, 0.05 + Math.random() * 0.1, 4, 60]} />
            <meshBasicMaterial
              color={i % 3 === 0 ? "#ff003c" : i % 2 === 0 ? "#00ffe1" : "#7a3cff"}
              transparent opacity={0.4} blending={THREE.AdditiveBlending}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
};

// ─── MAIN EXPORT ───────────────────────────────────────────────────────────────
export const AbyssScene = () => {
  const groupRef = useRef<THREE.Group>(null);
  const [isVisible, setIsVisible] = useState(false);
  
  useFrame(() => {
    const progress = scrollState.progress;
    
    if (progress > 0.6 && !isVisible) setIsVisible(true);
    if (progress <= 0.6 && isVisible) setIsVisible(false);

    if (groupRef.current && isVisible) {
      const zoom = 1 + Math.max(0, (progress - 0.75) * 0.8);
      groupRef.current.scale.set(zoom, zoom, zoom);
      
      if (progress > 0.85) {
        const intensity = Math.pow((progress - 0.85) * 6.6, 2);
        groupRef.current.position.x = (Math.random() - 0.5) * 0.8 * intensity;
        groupRef.current.position.y = (Math.random() - 0.5) * 0.8 * intensity;
      }
    }
  });

  if (!isVisible) return null;

  return (
    <group ref={groupRef}>
      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <directionalLight position={[20, 20, -20]} intensity={4.0} color="#ff003c" />
      <directionalLight position={[-20, -20, 20]} intensity={3.5} color="#00ffe1" />
      <pointLight position={[0, 0, -35]} intensity={15} distance={80} color="#7a3cff" />
      <pointLight position={[15, 10, -20]} intensity={6} distance={50} color="#ff6b00" />
      <pointLight position={[-15, -10, -20]} intensity={6} distance={50} color="#00ff88" />

      {/* Original elements */}
      <InsaneCore />
      {/* Removed CrashingMonoliths to clear space for the new DigitalEnvironment void focus */}

      {/* New brain / psychedelic elements */}
      <BrainWaveRibbons />
      <ChromaticVortex />
      <PsychedelicCloud />
      <NeuralSynapses />
    </group>
  );
};
