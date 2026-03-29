import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Stars, PerspectiveCamera, Environment, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

const FloatingShapes = () => {
    const shapes = useMemo(() => {
        return new Array(30).fill().map((_, i) => ({
            position: [
                (Math.random() - 0.5) * 40,
                (Math.random() - 0.5) * 40,
                Math.random() * -100 - 10
            ],
            rotation: [Math.random() * Math.PI, Math.random() * Math.PI, 0],
            scale: Math.random() * 1.5 + 0.5,
            color: i % 3 === 0 ? '#df4418' : i % 3 === 1 ? '#ffffff' : '#222222',
            speed: Math.random() * 0.5 + 0.2
        }));
    }, []);

    return (
        <>
            {shapes.map((s, i) => (
                <Float key={i} speed={s.speed * 4} rotationIntensity={2} floatIntensity={2}>
                    <mesh position={s.position} rotation={s.rotation} scale={s.scale}>
                        {i % 2 === 0 ? <boxGeometry args={[1, 1, 1]} /> : <sphereGeometry args={[0.7, 32, 32]} />}
                        <meshStandardMaterial 
                            color={s.color} 
                            roughness={0.1} 
                            metalness={0.8}
                            emissive={s.color === '#df4418' ? '#df4418' : '#000000'}
                            emissiveIntensity={s.color === '#df4418' ? 0.5 : 0}
                        />
                    </mesh>
                </Float>
            ))}
        </>
    );
};

const CameraRig = ({ scroll }) => {
    const cameraRef = useRef();

    useFrame((state) => {
        if (!cameraRef.current) return;
        
        // WORLD-ZOOM: Move camera deep into scenes at specific scroll milestones
        const targetZ = 15 - (scroll * 200); // Increased depth for better world-zoom
        cameraRef.current.position.z = THREE.MathUtils.lerp(cameraRef.current.position.z, targetZ, 0.05);
        
        // Add subtle rotation "drive" based on scroll velocity
        cameraRef.current.rotation.z = THREE.MathUtils.lerp(cameraRef.current.rotation.z, scroll * Math.PI * 0.2, 0.02);
        
        // Subtle tilt based on mouse
        cameraRef.current.position.x = THREE.MathUtils.lerp(cameraRef.current.position.x, state.mouse.x * 3, 0.05);
        cameraRef.current.position.y = THREE.MathUtils.lerp(cameraRef.current.position.y, state.mouse.y * 3, 0.05);

        // Dynamic Field of View for "speed" effect
        cameraRef.current.fov = 50 + (scroll * 20);
        cameraRef.current.updateProjectionMatrix();

        cameraRef.current.lookAt(0, 0, targetZ - 30);
    });

    return <PerspectiveCamera ref={cameraRef} makeDefault fov={50} />;
};

const HyperScene = ({ scroll = 0 }) => {
    return (
        <div className="fixed top-0 left-0 w-full h-full -z-10 bg-[#080808]">
            {/* Overlay Gradient for deeper void */}
            <div className="absolute inset-0 bg-radial-gradient from-transparent to-[#050505] opacity-80 pointer-events-none z-10" />
            
            <Canvas dpr={[1, 2]} gl={{ antialias: true, logarithmicDepthBuffer: true }}>
                <CameraRig scroll={scroll} />
                <ambientLight intensity={0.2} />
                <pointLight position={[20, 20, 20]} intensity={2.5} color="#df4418" />
                <pointLight position={[-20, -20, -20]} intensity={1.5} color="#4444ff" />
                <fog attach="fog" args={['#080808', 10, 80]} />
                <Stars radius={200} depth={100} count={8000} factor={8} saturation={0} fade speed={1.5} />
                <FloatingShapes />
                <Environment preset="night" />
            </Canvas>
        </div>
    );
};

export default HyperScene;
