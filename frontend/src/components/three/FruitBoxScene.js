import React, { Suspense, useCallback, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { 
  OrbitControls, 
  PerspectiveCamera, 
  useProgress, 
  Html,
  ContactShadows,
  Float,
  Text
} from '@react-three/drei';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import Fruit3D from './Fruit3D';

// Loading indicator
function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <LoadingText>
        {progress.toFixed(0)}% loaded
      </LoadingText>
    </Html>
  );
}

// Enhanced fruit with label and interactive features
const EnhancedFruit = ({ fruitType, position, label, onClick }) => {
  const [hovered, setHovered] = React.useState(false);
  const fruitRef = React.useRef();
  const scale = hovered ? 1.15 : 1;
  const y = hovered ? position[1] + 0.5 : position[1];

  React.useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : 'auto';
    if (fruitRef.current) {
      gsap.to(fruitRef.current.position, {
        y,
        duration: 0.5,
        ease: 'power3.out'
      });
      gsap.to(fruitRef.current.scale, {
        x: scale,
        y: scale,
        z: scale,
        duration: 0.5,
        ease: 'back.out(1.5)'
      });
    }
  }, [hovered, y, scale]);

  const handleClick = () => {
    if (onClick) {
      // Add click animation
      gsap.to(fruitRef.current.scale, {
        x: 1.3,
        y: 1.3,
        z: 1.3,
        duration: 0.2,
        ease: 'power2.out',
        onComplete: () => {
          gsap.to(fruitRef.current.scale, {
            x: 0.8,
            y: 0.8,
            z: 0.8,
            duration: 0.3,
            ease: 'back.in(2)',
            onComplete: () => onClick(fruitType)
          });
        }
      });
    }
  };

  return (
    <group 
      ref={fruitRef} 
      position={[position[0], position[1], position[2]]}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={handleClick}
    >
      <Fruit3D fruitType={fruitType} scale={1.2} />
      
      {/* Label underneath */}
      <Text
        position={[0, -1.8, 0]}
        fontSize={0.4}
        color="#333333"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#ffffff"
      >
        {label}
      </Text>
    </group>
  );
};

const FruitBoxScene = () => {
  const navigate = useNavigate();
  
  // Animation effect when component mounts
  useEffect(() => {
    // Animate loader with gsap
    gsap.to('.fruit-loader', {
      opacity: 0,
      duration: 1,
      delay: 2,
      ease: 'power2.out'
    });
    
    // Animate instruction text
    gsap.fromTo('.instruction-text',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 1, delay: 2.5, ease: 'power2.out' }
    );
  }, []);
  
  // Handle clicking on a fruit
  const handleFruitClick = useCallback((fruitType) => {
    // Animated transition
    gsap.to('.canvas-container', {
      opacity: 0.5,
      scale: 0.95,
      duration: 0.3,
      onComplete: () => {
        // Navigate to corresponding product category
        navigate(`/products?search=${fruitType}`);
      }
    });
  }, [navigate]);
  
  return (
    <SceneContainer>
      <Canvas 
        className="canvas-container"
        dpr={[1, 2]} 
        shadows 
        camera={{ position: [0, 2, 14], fov: 40 }}
        gl={{ antialias: true, alpha: false }}
      >
        <color attach="background" args={['#f8f8f8']} />
        <fog attach="fog" args={['#f8f8f8', 10, 25]} />
        
        {/* Better lighting */}
        <ambientLight intensity={0.6} />
        <directionalLight 
          position={[10, 10, 10]} 
          intensity={1} 
          castShadow 
          shadow-mapSize={[1024, 1024]}
          shadow-camera-far={50}
          shadow-camera-left={-10}
          shadow-camera-right={10}
          shadow-camera-top={10}
          shadow-camera-bottom={-10}
        />
        <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#d0d0ff" />
        <directionalLight position={[0, 10, 0]} intensity={0.8} color="#ffffff" />
        
        <Suspense fallback={<Loader />}>
          {/* Row of floating fruits with labels */}
          <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
            <EnhancedFruit fruitType="apple" position={[-6, 0, 0]} label="Apples" onClick={handleFruitClick} />
          </Float>
          
          <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.3}>
            <EnhancedFruit fruitType="orange" position={[-2, 0, 0]} label="Oranges" onClick={handleFruitClick} />
          </Float>
          
          <Float speed={2.2} rotationIntensity={0.3} floatIntensity={0.6}>
            <EnhancedFruit fruitType="banana" position={[2, 0, 0]} label="Bananas" onClick={handleFruitClick} />
          </Float>
          
          <Float speed={1.8} rotationIntensity={0.2} floatIntensity={0.4}>
            <EnhancedFruit fruitType="strawberry" position={[6, 0, 0]} label="Berries" onClick={handleFruitClick} />
          </Float>
          
          {/* Ground shadow under fruits */}
          <ContactShadows 
            position={[0, -1.8, 0]} 
            opacity={0.6} 
            scale={25} 
            blur={2.5} 
            far={5} 
            resolution={512} 
            color="#000000" 
          />
        </Suspense>
        
        <OrbitControls 
          enableZoom={false} 
          enablePan={false}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 2}
          rotateSpeed={0.5}
        />
        
        <PerspectiveCamera makeDefault position={[0, 2, 14]} fov={40} />
      </Canvas>
      
      <LoaderOverlay className="fruit-loader">
        <div className="spinner"></div>
        <p>Loading fresh produce...</p>
      </LoaderOverlay>
      
      <InstructionText className="instruction-text">
        <strong>Hover</strong> to elevate and <strong>click</strong> to shop for your favorite fruits!
      </InstructionText>

      {/* Visual hint for interactivity */}
      <VisualHint className="visual-hint">
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 5V19" stroke="#4caf50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M19 12L12 19L5 12" stroke="#4caf50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </VisualHint>
    </SceneContainer>
  );
};

const SceneContainer = styled.div`
  position: relative;
  width: 100%;
  height: 450px;
  margin: 40px auto;
  overflow: hidden;
  border-radius: 20px;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.2);
  background: #f8f8f8;
  background: linear-gradient(135deg, #fafafa 0%, #f0f0f0 100%);
`;

const LoaderOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: rgba(248, 248, 248, 0.9);
  z-index: 10;
  backdrop-filter: blur(5px);
  
  .spinner {
    width: 50px;
    height: 50px;
    border: 5px solid rgba(76, 175, 80, 0.3);
    border-radius: 50%;
    border-top-color: #4caf50;
    animation: spinner 1s ease-in-out infinite;
    margin-bottom: 15px;
  }
  
  p {
    color: #4caf50;
    font-size: 1.2rem;
    font-weight: 500;
  }
  
  @keyframes spinner {
    to {
      transform: rotate(360deg);
    }
  }
`;

const LoadingText = styled.div`
  color: #4caf50;
  font-size: 1.5rem;
  font-weight: bold;
  background: rgba(255, 255, 255, 0.8);
  padding: 10px 20px;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
`;

const InstructionText = styled.div`
  position: absolute;
  bottom: 20px;
  left: 0;
  right: 0;
  text-align: center;
  color: #555;
  font-size: 1rem;
  background: rgba(255, 255, 255, 0.8);
  padding: 10px 15px;
  margin: 0 20%;
  border-radius: 30px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(5px);
  
  strong {
    color: #4caf50;
    font-weight: 600;
  }
`;

const VisualHint = styled.div`
  position: absolute;
  top: 15px;
  right: 15px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  animation: bounce 2s infinite;
  
  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% {
      transform: translateY(0);
    }
    40% {
      transform: translateY(-10px);
    }
    60% {
      transform: translateY(-5px);
    }
  }
`;

export default FruitBoxScene; 