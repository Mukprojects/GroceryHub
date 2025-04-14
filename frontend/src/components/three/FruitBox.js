import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box, Text } from '@react-three/drei';
import { MeshWobbleMaterial } from '@react-three/drei';
import { gsap } from 'gsap';
import Fruit3D from './Fruit3D';

const FruitBox = ({ 
  fruitType, 
  position = [0, 0, 0], 
  color = '#ffffff', 
  label,
  onClick 
}) => {
  const boxRef = useRef();
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  
  // Animation on hover and click
  useFrame(() => {
    if (boxRef.current) {
      // Add gentle wobble animation
      boxRef.current.rotation.y += 0.002;
    }
  });
  
  // Handle hover and click effects
  const handleHover = (hovering) => {
    setHovered(hovering);
    if (boxRef.current) {
      gsap.to(boxRef.current.position, {
        y: hovering ? position[1] + 0.3 : position[1],
        duration: 0.5,
        ease: 'power2.out'
      });
    }
  };
  
  const handleClick = () => {
    setClicked(!clicked);
    if (onClick) onClick(fruitType);
    
    // Animation on click
    if (boxRef.current) {
      gsap.to(boxRef.current.rotation, {
        z: clicked ? 0 : Math.PI * 2,
        duration: 1,
        ease: 'elastic.out(1, 0.3)'
      });
    }
  };
  
  return (
    <group
      ref={boxRef}
      position={position}
      onPointerOver={() => handleHover(true)}
      onPointerOut={() => handleHover(false)}
      onClick={handleClick}
    >
      {/* Crate box */}
      <Box args={[2, 1.5, 2]} castShadow position={[0, -0.5, 0]}>
        <MeshWobbleMaterial 
          color={hovered ? '#ddc9a3' : '#c8b393'} 
          factor={0.2} 
          speed={0.5} 
          metalness={0.1}
          roughness={0.8}
        />
      </Box>
      
      {/* Fruit inside the box */}
      <Fruit3D 
        fruitType={fruitType} 
        position={[0, 0.3, 0]} 
        scale={0.8} 
      />
      
      {/* Label */}
      {label && (
        <Text
          position={[0, -1.2, 0]}
          fontSize={0.2}
          color="#000000"
          anchorX="center"
          anchorY="middle"
        >
          {label}
        </Text>
      )}
    </group>
  );
};

export default FruitBox; 