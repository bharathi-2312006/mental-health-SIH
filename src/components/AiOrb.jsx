import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// This component creates and animates the particles and connecting lines
const PlexusParticles = () => {
  const groupRef = useRef();
  const COUNT = 200; // Number of main nodes
  const DENSITY = 2; // How many connections per node
  const DISTANCE = 60; // How close nodes must be to connect

  // Create the initial random positions and velocities for particles just once
  const particles = useMemo(() => {
    return Array.from({ length: COUNT }, () => ({
      position: new THREE.Vector3(
        (Math.random() - 0.5) * 25,
        (Math.random() - 0.5) * 25,
        (Math.random() - 0.5) * 25
      ),
      velocity: new THREE.Vector3(
        (Math.random() - 0.5) * 0.02,
        (Math.random() - 0.5) * 0.02,
        (Math.random() - 0.5) * 0.02
      ),
    }));
  }, []);

  // This hook runs on every single frame to create the animation
  useFrame(() => {
    if (groupRef.current) {
      const positions = groupRef.current.children[0].geometry.attributes.position.array;
      const linePositions = groupRef.current.children[1].geometry.attributes.position.array;
      let vertexpos = 0;
      let colorpos = 0;
      let numConnected = 0;

      // Animate the main nodes
      particles.forEach((p, i) => {
        p.position.add(p.velocity);
        if (p.position.x < -12 || p.position.x > 12) p.velocity.x *= -1;
        if (p.position.y < -12 || p.position.y > 12) p.velocity.y *= -1;
        if (p.position.z < -12 || p.position.z > 12) p.velocity.z *= -1;
        
        positions[i * 3] = p.position.x;
        positions[i * 3 + 1] = p.position.y;
        positions[i * 3 + 2] = p.position.z;
      });

      // Animate the connecting lines
      for (let i = 0; i < COUNT; i++) {
        for (let j = i + 1; j < COUNT; j++) {
          const p1 = particles[i].position;
          const p2 = particles[j].position;
          const dist = p1.distanceTo(p2);

          if (dist < DISTANCE && numConnected < COUNT * DENSITY) {
            linePositions[vertexpos++] = p1.x;
            linePositions[vertexpos++] = p1.y;
            linePositions[vertexpos++] = p1.z;
            linePositions[vertexpos++] = p2.x;
            linePositions[vertexpos++] = p2.y;
            linePositions[vertexpos++] = p2.z;
            numConnected++;
          }
        }
      }

      groupRef.current.children[0].geometry.attributes.position.needsUpdate = true;
      groupRef.current.children[1].geometry.setDrawRange(0, numConnected * 2);
      groupRef.current.children[1].geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group ref={groupRef}>
      {/* The main nodes */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={COUNT}
            array={new Float32Array(COUNT * 3)}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial size={0.2} color="#00ffff" />
      </points>
      {/* The connecting lines */}
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={COUNT * DENSITY * 2}
            array={new Float32Array(COUNT * DENSITY * 3 * 2)}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#ffffff" transparent opacity={0.05} />
      </lineSegments>
    </group>
  );
};

// The wrapper component that sets up the 3D scene
const NeuralNetworkCanvas = () => (
  <div className="absolute top-0 left-0 w-full h-full z-0">
    <Canvas camera={{ position: [0, 0, 15] }}>
      <PlexusParticles />
    </Canvas>
  </div>
);

export default NeuralNetworkCanvas;
