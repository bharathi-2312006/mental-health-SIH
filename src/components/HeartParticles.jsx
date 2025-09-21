import React, { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text3D, Center } from '@react-three/drei';
import * as THREE from 'three';

// --- This component renders the floating text ---
const FloatingText = () => {
  const textRef = useRef();

  useFrame(({ clock }) => {
    if (textRef.current) {
      // Gentle floating motion
      textRef.current.position.y = 7 + Math.sin(clock.getElapsedTime() * 0.5) * 0.15;
    }
  });

  return (
    // Center the text horizontally and set its initial position higher up
    <Center ref={textRef} position={[0, 7, 0]} rotation={[-0.1, 0, 0]}>
      <Text3D
        font="https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/fonts/helvetiker_bold.typeface.json"
        size={1}
        height={0.2}
        curveSegments={12}
        bevelEnabled
        bevelThickness={0.02}
        bevelSize={0.02}
      >
        {`Your feelings are valid`}
        <meshStandardMaterial color="#F9A8D4" emissive="#F472B6" emissiveIntensity={0.6} roughness={0.2} metalness={0.1} />
      </Text3D>
    </Center>
  );
};

// --- This component renders the heart particles ---
const HeartParticles = () => {
  const pointsRef = useRef();
  // Increased particle count for a denser heart
  const COUNT = 5000;

  const particles = useMemo(() => {
    return Array.from({ length: COUNT }, () => ({
      theta: Math.random() * Math.PI * 2,
      speed: 0.1 + Math.random() * 0.2,
    }));
  }, []);

  useFrame(({ clock }) => {
    if (pointsRef.current) {
      const t = clock.getElapsedTime();
      const positions = pointsRef.current.geometry.attributes.position.array;

      for (let i = 0; i < COUNT; i++) {
        const { theta, speed } = particles[i];
        const i3 = i * 3;
        
        const scale = 4.0 + 1.5 * Math.sin(t * speed); 
        const x = scale * 16 * Math.pow(Math.sin(theta), 3);
        const y = scale * (13 * Math.cos(theta) - 5 * Math.cos(2 * theta) - 2 * Math.cos(3 * theta) - Math.cos(4 * theta));
        const z = (Math.random() - 0.5) * 4;

        positions[i3] = x / 10;
        positions[i3 + 1] = y / 10;
        positions[i3 + 2] = z;
      }

      pointsRef.current.geometry.attributes.position.needsUpdate = true;
      pointsRef.current.rotation.y += 0.001;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={COUNT} array={new Float32Array(COUNT * 3)} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.09} color="#F472B6" blending={THREE.AdditiveBlending} transparent={true} opacity={0.9} depthWrite={false} />
    </points>
  );
};

// --- The main component that combines everything ---
const HeartParticleCanvas = () => (
  <div className="absolute top-0 left-0 w-full h-full z-0">
    <Canvas camera={{ position: [0, 0, 16] }}>
      <Suspense fallback={null}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1.5} />
        <HeartParticles />
        <FloatingText />
      </Suspense>
    </Canvas>
  </div>
);

export default HeartParticleCanvas;

