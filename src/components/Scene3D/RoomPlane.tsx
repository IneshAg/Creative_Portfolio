import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { scrollState } from '../../store/scrollStore';

const vertexShader = `
attribute vec3 aCenter;
varying vec2 vUv;
varying float vDetached;
uniform float uProgress;

// 3D Noise function
float hash(vec3 p) {
    p = fract(p * 0.3183099 + 0.1);
    p *= 17.0;
    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
}

void main() {
  vUv = uv;
  vec3 pos = position;
  
  // Base structural noise for this triangle
  float n = hash(aCenter * 15.0);
  
  // Approximate Object Masks (UV space)
  // Computer Monitor area (approximate right side of desk)
  float isMonitor = step(0.45, aCenter.x) * step(aCenter.x, 0.65) * step(0.35, aCenter.y) * step(aCenter.y, 0.55);
  // Vinyl Record area (left side)
  float isVinyl = step(0.05, aCenter.x) * step(aCenter.x, 0.30) * step(0.35, aCenter.y) * step(aCenter.y, 0.70);
  // Desk and immediate surroundings
  float isDesk = step(0.1, aCenter.x) * step(aCenter.x, 0.8) * step(0.1, aCenter.y) * step(aCenter.y, 0.4);
  
  // Determine Local Tearing Timeline
  float localTear = 0.0;
  
  if (isMonitor > 0.0) {
     localTear = max(0.0, (uProgress - 0.25) * 15.0);
  } else if (isVinyl > 0.0) {
     localTear = max(0.0, (uProgress - 0.35) * 12.0);
  } else if (isDesk > 0.0) {
     localTear = max(0.0, (uProgress - 0.50) * 10.0);
  } else {
     localTear = max(0.0, (uProgress - 0.70) * 10.0);
  }
  
  // Detachment threshold
  float detachment = localTear - (n * 0.8);
  vDetached = 0.0;
  
  if (detachment > 0.0) {
    vDetached = 1.0;
    
    // Independent particle drift physics
    vec3 velocity = vec3(
      (hash(aCenter + 1.0) - 0.5) * 2.5,
      (hash(aCenter + 2.0) - 0.5) * 2.5 + 0.5,
      -3.0 - hash(aCenter + 3.0) * 8.0 // pull deeply into the void
    );
    
    // Rotation mechanics
    float rotAngle = detachment * (hash(aCenter) * 10.0 - 5.0);
    float cRot = cos(rotAngle);
    float sRot = sin(rotAngle);
    vec3 localPos = pos - aCenter;
    
    float newX = localPos.x * cRot - localPos.y * sRot;
    float newY = localPos.x * sRot + localPos.y * cRot;
    localPos.xy = vec2(newX, newY);
    
    // Apply translation with extremely high multiplier so they clear the screen
    pos = aCenter + localPos + (velocity * detachment * 6.0);
    
    // Scale down as they drift away
    float scale = max(0.0, 1.0 - detachment * 0.1);
    pos = aCenter + (pos - aCenter) * scale;
  }
  
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
`;

const fragmentShader = `
varying vec2 vUv;
varying float vDetached;
uniform sampler2D tDiffuse;
uniform float uProgress;

float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

void main() {
  vec2 uv = vUv;
  
  // Object Masks for fragment-level localized RGB splitting
  float isMonitor = step(0.45, uv.x) * step(uv.x, 0.65) * step(0.35, uv.y) * step(uv.y, 0.55);
  float isVinyl = step(0.05, uv.x) * step(uv.x, 0.30) * step(0.35, uv.y) * step(uv.y, 0.70);
  
  // Localized RGB offset logic (No global RGB until the climax)
  float splitIntensity = 0.0;
  
  if (isMonitor > 0.0 && uProgress > 0.20 && uProgress < 0.8) {
      splitIntensity += (uProgress - 0.20) * 0.02 * random(uv + uProgress);
  }
  
  if (isVinyl > 0.0 && uProgress > 0.35 && uProgress < 0.8) {
      splitIntensity += (uProgress - 0.35) * 0.03 * random(uv - uProgress);
  }
  
  if (uProgress > 0.75) {
      float climax = (uProgress - 0.75) * 4.0;
      splitIntensity += climax * 0.05 * random(uv * uProgress);
  }
  
  float glitchLine = step(0.95, random(vec2(uv.y * 100.0, uProgress)));
  if (uProgress > 0.4 && vDetached == 0.0) {
      float tearForce = (uProgress - 0.4) * 0.02;
      uv.x += glitchLine * tearForce * (random(uv) - 0.5);
  }
  
  vec2 rUv = uv + vec2(splitIntensity, 0.0);
  vec2 bUv = uv - vec2(splitIntensity, 0.0);
  
  float r = texture2D(tDiffuse, rUv).r;
  float g = texture2D(tDiffuse, uv).g;
  float b = texture2D(tDiffuse, bUv).b;
  
  gl_FragColor = vec4(r, g, b, 1.0);
}
`;

interface RoomPlaneProps {
  isPlaying: boolean;
}

export const RoomPlane: React.FC<RoomPlaneProps> = ({ isPlaying }) => {
  const { viewport } = useThree();
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  
  const videoTexture = useMemo(() => {
    const video = document.createElement('video');
    video.src = '/assets/vinyl_record.mp4';
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    return new THREE.VideoTexture(video);
  }, []);

  React.useEffect(() => {
    if (isPlaying) {
      videoTexture.image.play().catch(() => {});
    } else {
      videoTexture.image.pause();
    }
  }, [isPlaying, videoTexture]);

  useFrame(() => {
    const p = scrollState.progress;
    if (materialRef.current) {
      materialRef.current.uniforms.uProgress.value = p;
    }
  });

  const uniforms = useMemo(
    () => ({
      tDiffuse: { value: videoTexture },
      uProgress: { value: 0 },
    }),
    [videoTexture]
  );

  const geometry = useMemo(() => {
    // 45x45 creates chunky, legible shards instead of tiny noisy static
    const geom = new THREE.PlaneGeometry(viewport.width, viewport.height, 45, 45).toNonIndexed();
    const posAttribute = geom.attributes.position;
    const centers = new Float32Array(posAttribute.count * 3);
    
    for (let i = 0; i < posAttribute.count; i += 3) {
       const cx = (posAttribute.getX(i) + posAttribute.getX(i+1) + posAttribute.getX(i+2)) / 3;
       const cy = (posAttribute.getY(i) + posAttribute.getY(i+1) + posAttribute.getY(i+2)) / 3;
       const cz = (posAttribute.getZ(i) + posAttribute.getZ(i+1) + posAttribute.getZ(i+2)) / 3;
       
       for (let j = 0; j < 3; j++) {
          centers[(i + j) * 3] = cx;
          centers[(i + j) * 3 + 1] = cy;
          centers[(i + j) * 3 + 2] = cz;
       }
    }
    geom.setAttribute('aCenter', new THREE.BufferAttribute(centers, 3));
    return geom;
  }, [viewport]);

  return (
    <group position={[0, 0, 0]}>
      <mesh geometry={geometry}>
        <shaderMaterial
          ref={materialRef}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
          transparent={true}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
};
