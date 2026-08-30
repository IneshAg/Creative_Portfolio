import { useRef, useMemo, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { scrollState } from '../../store/scrollStore';

// 1. A Massive, Violent Core
const InsaneCore = () => {
  const coreRef = useRef<THREE.Mesh>(null);
  const shellRef = useRef<THREE.Mesh>(null);
  const ringsRef = useRef<THREE.Group>(null);
  
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (coreRef.current && shellRef.current) {
      // Violent, glitchy scaling
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
         child.rotation.x += (Math.sin(t * 5.0 + i) > 0 ? 0.05 : -0.05); // Snap rotation
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
      
      {/* Glitching Shell */}
      <mesh ref={shellRef}>
        <icosahedronGeometry args={[8.5, 1]} />
        <meshBasicMaterial color="#ff003c" wireframe transparent opacity={0.6} blending={THREE.AdditiveBlending} />
      </mesh>

      {/* Frantic Orbiting Rings */}
      <group ref={ringsRef}>
        {[...Array(12)].map((_, i) => (
          <mesh key={i} rotation={[Math.random() * Math.PI, Math.random() * Math.PI, 0]}>
            <torusGeometry args={[12 + i * 2, 0.05 + Math.random() * 0.1, 4, 60]} />
            <meshBasicMaterial color={i % 3 === 0 ? "#ff003c" : i % 2 === 0 ? "#00ffe1" : "#7a3cff"} transparent opacity={0.4} blending={THREE.AdditiveBlending} />
          </mesh>
        ))}
      </group>
    </group>
  );
};

// 2. Huge, Aggressive Monoliths crashing into each other
const CrashingMonoliths = () => {
  const count = 60;
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos((Math.random() * 2) - 1);
      const r = 15 + Math.random() * 40; 
      
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi) - 35; 
      
      temp.push({
        position: new THREE.Vector3(x, y, z),
        rotation: new THREE.Vector3(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI),
        // Extremely long and thin, or massive blocks
        scale: new THREE.Vector3(1 + Math.random()*4, 10 + Math.random()*30, 1 + Math.random()*4),
        speed: 1.0 + Math.random() * 3.0,
      });
    }
    return temp;
  }, []);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    
    particles.forEach((p, i) => {
      dummy.position.copy(p.position);
      
      const angle = t * p.speed * 0.2;
      const currentX = p.position.x;
      const currentZ = p.position.z + 35;
      
      dummy.position.x = currentX * Math.cos(angle) - currentZ * Math.sin(angle);
      dummy.position.z = currentX * Math.sin(angle) + currentZ * Math.cos(angle) - 35;
      
      dummy.position.y = p.position.y + Math.sin(t * p.speed * 5.0 + i) * 4.0;

      // Aggressive tumbling
      dummy.rotation.x = p.rotation.x + t * p.speed * 0.5;
      dummy.rotation.y = p.rotation.y + t * p.speed * 0.5;
      dummy.scale.copy(p.scale);
      
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#08080a" roughness={0.7} metalness={0.8} wireframe={Math.random() > 0.5} />
    </instancedMesh>
  );
};

export const AbyssScene = () => {
  const groupRef = useRef<THREE.Group>(null);
  const [isVisible, setIsVisible] = useState(false);
  
  useFrame(() => {
    const progress = scrollState.progress;
    
    // Only render when the room is actually breaking apart, to prevent 
    // any 3D geometry from clipping through the room while it's intact!
    if (progress > 0.6 && !isVisible) setIsVisible(true);
    if (progress <= 0.6 && isVisible) setIsVisible(false);

    if (groupRef.current && isVisible) {
      // Violent camera shake / descent
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
      <ambientLight intensity={0.5} />
      <directionalLight position={[20, 20, -20]} intensity={4.0} color="#ff003c" />
      <directionalLight position={[-20, -20, 20]} intensity={3.5} color="#00ffe1" />
      <pointLight position={[0, 0, -35]} intensity={15} distance={80} color="#7a3cff" />
      
      <InsaneCore />
      <CrashingMonoliths />
    </group>
  );
};
