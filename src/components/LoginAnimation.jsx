import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// This component creates the individual twinkling stars
const StarParticles = ({ mouse }) => {
  const pointsRef = useRef();
  const COUNT = 5000; // The total number of stars

  // Create the initial random positions for stars just once for performance
  const positions = useMemo(() => {
    const pos = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT * 3; i++) {
      // Spread the stars across a large area
      pos[i] = (Math.random() - 0.5) * 20;
    }
    return pos;
  }, []);

  // This hook runs on every single frame to create the animation
  useFrame((state, delta) => {
    if (pointsRef.current) {
      // Gently rotate the entire starfield
      pointsRef.current.rotation.x += delta / 20;
      pointsRef.current.rotation.y += delta / 25;

      // Make the starfield subtly react to the mouse position
      const targetX = (mouse.current.x / state.viewport.width) * 2;
      const targetY = (mouse.current.y / state.viewport.height) * 2;
      pointsRef.current.rotation.y = THREE.MathUtils.lerp(pointsRef.current.rotation.y, targetX * 0.5, 0.1);
      pointsRef.current.rotation.x = THREE.MathUtils.lerp(pointsRef.current.rotation.x, targetY * 0.5, 0.1);
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
        size={0.02}
        color="#818CF8" // A soft indigo color
        blending={THREE.AdditiveBlending}
        transparent={true}
        opacity={0.9}
        depthWrite={false}
      />
    </points>
  );
};

// This is the wrapper component that sets up the 3D scene
const LoginAnimation = () => {
    const mouse = useRef({ x: 0, y: 0 });

    const handleMouseMove = (event) => {
        mouse.current.x = event.clientX;
        mouse.current.y = event.clientY;
    };

    return (
        <div 
            className="absolute top-0 left-0 w-full h-full z-0"
            onMouseMove={handleMouseMove}
        >
            <Canvas camera={{ position: [0, 0, 5] }}>
                <StarParticles mouse={mouse} />
            </Canvas>
        </div>
    );
};

export default LoginAnimation;
