import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function Fruit3D({ fruitType = 'apple', position = [0, 0, 0], scale = 1, rotation = [0, 0, 0] }) {
  const fruitRef = useRef();
  const detailsRef = useRef();
  
  // Rotate the fruit
  useFrame((state) => {
    if (fruitRef.current) {
      fruitRef.current.rotation.y += 0.01;
    }
    if (detailsRef.current) {
      detailsRef.current.rotation.y += 0.01;
    }
  });
  
  // Define fruit colors and materials
  const fruitMaterials = {
    apple: {
      main: new THREE.MeshStandardMaterial({
        color: '#D12026', // rich red
        roughness: 0.2,
        metalness: 0.0,
        envMapIntensity: 0.8
      }),
      details: new THREE.MeshStandardMaterial({
        color: '#7C3904', // brown stem
        roughness: 0.7,
        metalness: 0.0
      }),
      highlights: new THREE.MeshStandardMaterial({
        color: '#FFFFFF',
        roughness: 0.0,
        metalness: 0.9,
        transparent: true,
        opacity: 0.2
      })
    },
    orange: {
      main: new THREE.MeshStandardMaterial({
        color: '#FF8C13', // vibrant orange
        roughness: 0.3,
        metalness: 0.0,
        envMapIntensity: 0.8
      }),
      details: new THREE.MeshStandardMaterial({
        color: '#33891A', // green leaf
        roughness: 0.6,
        metalness: 0.0
      }),
      highlights: new THREE.MeshStandardMaterial({
        color: '#FFFFFF',
        roughness: 0.0,
        metalness: 0.9,
        transparent: true,
        opacity: 0.2
      })
    },
    banana: {
      main: new THREE.MeshStandardMaterial({
        color: '#FFDC14', // yellow
        roughness: 0.3,
        metalness: 0.0,
        envMapIntensity: 0.8
      }),
      details: new THREE.MeshStandardMaterial({
        color: '#855723', // brown stem
        roughness: 0.7,
        metalness: 0.0
      }),
      highlights: new THREE.MeshStandardMaterial({
        color: '#FFFFFF',
        roughness: 0.0,
        metalness: 0.9,
        transparent: true, 
        opacity: 0.2
      })
    },
    strawberry: {
      main: new THREE.MeshStandardMaterial({
        color: '#EE2E31', // bright red
        roughness: 0.3,
        metalness: 0.0,
        envMapIntensity: 0.8
      }),
      details: new THREE.MeshStandardMaterial({
        color: '#33891A', // green stem
        roughness: 0.6,
        metalness: 0.0
      }),
      highlights: new THREE.MeshStandardMaterial({
        color: '#FFFFFF',
        roughness: 0.0,
        metalness: 0.9,
        transparent: true,
        opacity: 0.2
      })
    }
  };
  
  const materials = fruitMaterials[fruitType] || fruitMaterials.apple;
  
  // Create fruit meshes based on type
  switch (fruitType) {
    case 'apple':
      return (
        <group position={position} scale={[scale, scale, scale]} rotation={rotation}>
          {/* Main apple body */}
          <mesh ref={fruitRef}>
            <sphereGeometry args={[1, 32, 32]} />
            <primitive object={materials.main} attach="material" />
          </mesh>
          
          {/* Apple stem */}
          <group ref={detailsRef} position={[0, 0.9, 0]}>
            <mesh position={[0, 0.15, 0]}>
              <cylinderGeometry args={[0.08, 0.05, 0.3, 8]} />
              <primitive object={materials.details} attach="material" />
            </mesh>
            
            {/* Small leaf */}
            <mesh position={[0.1, 0.15, 0.05]} rotation={[0, 0, Math.PI / 4]}>
              <boxGeometry args={[0.2, 0.05, 0.1]} />
              <meshStandardMaterial color="#33891A" roughness={0.6} />
            </mesh>
          </group>
          
          {/* Highlight */}
          <mesh position={[-0.4, 0.4, 0.7]} rotation={[0, 0, Math.PI / 4]}>
            <sphereGeometry args={[0.4, 16, 16]} />
            <primitive object={materials.highlights} attach="material" />
          </mesh>
        </group>
      );
      
    case 'orange':
      return (
        <group position={position} scale={[scale, scale, scale]} rotation={rotation}>
          {/* Main orange body */}
          <mesh ref={fruitRef}>
            <sphereGeometry args={[1, 32, 32]} />
            <primitive object={materials.main} attach="material" />
          </mesh>
          
          {/* Orange texture - bumps */}
          <mesh>
            <sphereGeometry args={[1.01, 32, 32]} />
            <meshStandardMaterial 
              color="#FF8C13" 
              roughness={0.8}
              transparent={true}
              opacity={0.3}
              bumpScale={0.05}
            />
          </mesh>
          
          {/* Orange stem/leaf */}
          <group ref={detailsRef} position={[0, 0.9, 0]}>
            <mesh position={[0, 0.1, 0]}>
              <cylinderGeometry args={[0.1, 0.1, 0.2, 8]} />
              <primitive object={materials.details} attach="material" />
            </mesh>
            
            {/* Leaf */}
            <mesh position={[0.2, 0.1, 0]} rotation={[0, 0, Math.PI / 6]}>
              <boxGeometry args={[0.3, 0.05, 0.15]} />
              <primitive object={materials.details} attach="material" />
            </mesh>
          </group>
          
          {/* Highlight */}
          <mesh position={[-0.4, 0.4, 0.7]} rotation={[0, 0, Math.PI / 4]}>
            <sphereGeometry args={[0.4, 16, 16]} />
            <primitive object={materials.highlights} attach="material" />
          </mesh>
        </group>
      );
      
    case 'banana':
      return (
        <group position={position} scale={[scale, scale, scale]} rotation={[0.3, ...rotation.slice(1)]}>
          {/* Main banana curved shape */}
          <mesh ref={fruitRef}>
            <torusGeometry args={[0.7, 0.3, 16, 32, Math.PI]} />
            <primitive object={materials.main} attach="material" />
          </mesh>
          
          {/* Banana ends */}
          <mesh position={[-0.7, 0, 0]} rotation={[Math.PI/2, 0, 0]}>
            <sphereGeometry args={[0.3, 16, 16, 0, Math.PI]} />
            <primitive object={materials.main} attach="material" />
          </mesh>
          
          <mesh position={[0.7, 0, 0]} rotation={[Math.PI/2, 0, Math.PI]}>
            <sphereGeometry args={[0.3, 16, 16, 0, Math.PI]} />
            <primitive object={materials.main} attach="material" />
          </mesh>
          
          {/* Banana stem */}
          <mesh ref={detailsRef} position={[-0.7, 0.1, 0]} rotation={[0, 0, -Math.PI/6]}>
            <cylinderGeometry args={[0.05, 0.08, 0.2, 8]} />
            <primitive object={materials.details} attach="material" />
          </mesh>
          
          {/* Highlight */}
          <mesh position={[0.1, 0.2, 0.3]} rotation={[0, 0, Math.PI / 4]}>
            <sphereGeometry args={[0.3, 16, 16]} />
            <primitive object={materials.highlights} attach="material" />
          </mesh>
        </group>
      );
      
    case 'strawberry':
      return (
        <group position={position} scale={[scale, scale, scale]} rotation={rotation}>
          {/* Main strawberry body */}
          <mesh ref={fruitRef}>
            <coneGeometry args={[1, 1.6, 32, 16]} />
            <primitive object={materials.main} attach="material" />
          </mesh>
          
          {/* Strawberry seeds */}
          {Array.from({ length: 20 }).map((_, i) => (
            <mesh key={i} position={[
              Math.sin(i * 3) * 0.8 * Math.random(), 
              (Math.random() - 0.5) * 1.2, 
              Math.cos(i * 3) * 0.8 * Math.random()
            ]}>
              <sphereGeometry args={[0.06, 8, 8]} />
              <meshStandardMaterial color="#FFE16F" roughness={0.7} />
            </mesh>
          ))}
          
          {/* Strawberry stem and leaves */}
          <group ref={detailsRef} position={[0, 0.8, 0]}>
            <mesh position={[0, 0.1, 0]}>
              <cylinderGeometry args={[0.2, 0.2, 0.2, 12]} />
              <primitive object={materials.details} attach="material" />
            </mesh>
            
            {/* Leaves */}
            {Array.from({ length: 3 }).map((_, i) => (
              <mesh 
                key={i} 
                position={[
                  Math.sin(i * Math.PI * 2/3) * 0.2, 
                  0.2, 
                  Math.cos(i * Math.PI * 2/3) * 0.2
                ]}
                rotation={[0.3, i * Math.PI * 2/3, 0]}
              >
                <coneGeometry args={[0.2, 0.4, 5, 1]} />
                <primitive object={materials.details} attach="material" />
              </mesh>
            ))}
          </group>
          
          {/* Highlight */}
          <mesh position={[-0.3, -0.3, 0.5]} rotation={[0, 0, Math.PI / 4]}>
            <sphereGeometry args={[0.3, 16, 16]} />
            <primitive object={materials.highlights} attach="material" />
          </mesh>
        </group>
      );
      
    default:
      return (
        <mesh
          ref={fruitRef}
          position={position}
          scale={[scale, scale, scale]}
          rotation={rotation}
        >
          <sphereGeometry args={[1, 32, 32]} />
          <meshStandardMaterial color="#00FF00" roughness={0.3} metalness={0.1} />
        </mesh>
      );
  }
}

export default Fruit3D; 