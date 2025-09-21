import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// This component creates the individual floating particles
const FloatingParticles = () => {
  const pointsRef = useRef();
  const COUNT = 5000; // The total number of particles
  const SEPARATION = 10; // How far apart the particles are spread

  // Create the initial random positions for particles just once for performance
  const positions = useMemo(() => {
    const pos = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT * 3; i++) {
      pos[i] = (Math.random() - 0.5) * SEPARATION;
    }
    return pos;
  }, []);

  // This hook runs on every single frame to create the animation
  useFrame(() => {
    if (pointsRef.current) {
      const positions = pointsRef.current.geometry.attributes.position.array;
      for (let i = 0; i < COUNT; i++) {
        const i3 = i * 3;
        
        // Animate each particle to float upwards slowly
        positions[i3 + 1] += 0.005;
        
        // If a particle goes off the top of the screen, reset it to the bottom
        if (positions[i3 + 1] > SEPARATION / 2) {
          positions[i3 + 1] = -SEPARATION / 2;
        }
      }
      // Tell the renderer that the positions have been updated
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={COUNT}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#5EEAD4" // A calming teal/mint color
        blending={THREE.AdditiveBlending} // Creates a glowing effect where particles overlap
        transparent={true}
        opacity={0.8}
        depthWrite={false}
      />
    </points>
  );
};

// This is the wrapper component that sets up the 3D scene
const CalmParticleCanvas = () => (
  <div className="absolute top-0 left-0 w-full h-full z-0">
    <Canvas camera={{ position: [0, 0, 5] }}>
      <FloatingParticles />
    </Canvas>
  </div>
);

export default CalmParticleCanvas;
