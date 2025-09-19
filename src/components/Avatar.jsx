import React, { Suspense, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import { MathUtils } from 'three';

// This component now accepts an `isSpeaking` prop
function Model({ isSpeaking }) {
  const { scene, nodes } = useGLTF('https://models.readyplayer.me/68ca818cb012b373e13dfd46.glb');
  const headMesh = useRef();

  // Find the head mesh once the model is loaded
  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh && child.name === 'Wolf3D_Head') {
        headMesh.current = child;
      }
    });
  }, [scene]);

  // useFrame is a hook that runs on every single rendered frame
  useFrame((state) => {
    // If the head mesh or its morph targets aren't ready, do nothing
    if (!headMesh.current || !headMesh.current.morphTargetDictionary) return;

    // These are the names of the morph targets from the Ready Player Me model
    const jawOpen = headMesh.current.morphTargetDictionary['jawOpen'];
    const mouthOpen = headMesh.current.morphTargetDictionary['mouthOpen'];
    const blinkLeft = headMesh.current.morphTargetDictionary['eyeBlinkLeft'];
    const blinkRight = headMesh.current.morphTargetDictionary['eyeBlinkRight'];

    if (isSpeaking) {
      // --- TALKING ANIMATION ---
      // Use a sine wave to make the mouth open and close rhythmically
      const talkValue = Math.sin(state.clock.elapsedTime * 10) * 0.5 + 0.5;
      headMesh.current.morphTargetInfluences[jawOpen] = MathUtils.lerp(
        headMesh.current.morphTargetInfluences[jawOpen],
        talkValue,
        0.5
      );
       headMesh.current.morphTargetInfluences[mouthOpen] = MathUtils.lerp(
        headMesh.current.morphTargetInfluences[mouthOpen],
        talkValue / 2,
        0.5
      );

      // --- BLINKING ANIMATION ---
      // Make the avatar blink randomly while talking
      const blinkValue = Math.sin(state.clock.elapsedTime * 2) > 0.98 ? 1 : 0;
      headMesh.current.morphTargetInfluences[blinkLeft] = blinkValue;
      headMesh.current.morphTargetInfluences[blinkRight] = blinkValue;

    } else {
      // --- RETURN TO RESTING STATE ---
      // If not speaking, smoothly close the mouth and open the eyes
      headMesh.current.morphTargetInfluences[jawOpen] = MathUtils.lerp(
        headMesh.current.morphTargetInfluences[jawOpen],
        0,
        0.1
      );
      headMesh.current.morphTargetInfluences[mouthOpen] = MathUtils.lerp(
        headMesh.current.morphTargetInfluences[mouthOpen],
        0,
        0.1
      );
      headMesh.current.morphTargetInfluences[blinkLeft] = 0;
      headMesh.current.morphTargetInfluences[blinkRight] = 0;
    }
  });

  return <primitive object={scene} scale={1.2} position={[0, -1.8, 0]} />;
}

export default function Avatar({ isSpeaking }) {
  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [0, 0, 2.5], fov: 25 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.6} />
          <directionalLight intensity={1.0} position={[5, 5, 5]} />
          <Model isSpeaking={isSpeaking} />
          <OrbitControls 
            enableZoom={false} 
            enablePan={false}
            minPolarAngle={Math.PI / 2.2}
            maxPolarAngle={Math.PI / 2.2}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}