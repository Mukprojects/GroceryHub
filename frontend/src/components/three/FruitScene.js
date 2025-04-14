import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, PerspectiveCamera } from '@react-three/drei';
import styled from 'styled-components';
import Fruit3D from './Fruit3D';

const FruitScene = ({ height = '400px', width = '100%', fruitTypes = ['apple', 'orange', 'banana', 'strawberry'] }) => {
  return (
    <SceneContainer style={{ height, width }}>
      <Canvas dpr={[1, 2]} shadows>
        <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={40} />
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={1}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        
        <Suspense fallback={null}>
          {/* Place fruits in an aesthetically pleasing arrangement */}
          <Fruit3D fruitType="apple" position={[-3, 0, 0]} scale={1.2} />
          <Fruit3D fruitType="orange" position={[-1, -1, 0]} scale={1} />
          <Fruit3D fruitType="banana" position={[1, 0, 0]} rotation={[0.5, 0, 0.2]} scale={1.3} />
          <Fruit3D fruitType="strawberry" position={[3, -0.5, 0]} scale={0.8} />
          
          {/* Environment creates a nice lighting effect */}
          <Environment preset="sunset" />
        </Suspense>
        
        {/* Allow user to rotate the scene */}
        <OrbitControls 
          enableZoom={false} 
          enablePan={false}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 2}
          rotateSpeed={0.5}
        />
      </Canvas>
    </SceneContainer>
  );
};

const SceneContainer = styled.div`
  position: relative;
  width: 100%;
  height: 400px;
  margin: 0 auto;
  overflow: hidden;
  border-radius: 8px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
`;

export default FruitScene; 