import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Stars, PerspectiveCamera, Environment, MeshDistortMaterial, Text, Sparkles } from '@react-three/drei';
import { EffectComposer, Bloom, Noise, Vignette, ChromaticAberration } from '@react-three/postprocessing';
import * as THREE from 'three';

// --- ZONE COMPONENTS ---

const HeroZone = () => (
    <group position={[0, 0, 0]}>
        <Sparkles count={200} scale={20} size={2} speed={0.4} color="#df4418" opacity={0.1} />
        <Float speed={2} rotationIntensity={1} floatIntensity={1}>
            <mesh position={[0, 0, -20]}>
                <torusKnotGeometry args={[10, 3, 100, 16]} />
                <meshStandardMaterial color="#df4418" wireframe transparent opacity={0.05} />
            </mesh>
        </Float>
    </group>
);

const ProjectsZone = () => {
    const tunnelParts = useMemo(() => new Array(10).fill().map((_, i) => ({
        z: -100 - (i * 20),
        rotation: (i * Math.PI) / 4
    })), []);

    return (
        <group position={[0, 0, 0]}>
            {tunnelParts.map((p, i) => (
                <mesh key={i} position={[0, 0, p.z]} rotation-z={p.rotation}>
                    <ringGeometry args={[15, 15.5, 4]} />
                    <meshStandardMaterial 
                        color="#df4418" 
                        emissive="#df4418" 
                        emissiveIntensity={2} 
                        transparent 
                        opacity={0.3} 
                    />
                </mesh>
            ))}
            <Sparkles count={500} scale={[40, 40, 100]} size={1} speed={1} position={[0, 0, -150]} color="#ffffff" />
        </group>
    );
};

const SkillsZone = () => {
    const nodes = useMemo(() => new Array(50).fill().map(() => [
        (Math.random() - 0.5) * 60,
        (Math.random() - 0.5) * 60,
        -300 - Math.random() * 100
    ]), []);

    return (
        <group>
            {nodes.map((pos, i) => (
                <mesh key={i} position={pos}>
                    <sphereGeometry args={[0.2, 16, 16]} />
                    <meshStandardMaterial color="#4444ff" emissive="#4444ff" emissiveIntensity={5} />
                </mesh>
            ))}
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={2} />
        </group>
    );
};

const BlogZone = () => (
    <group position={[0, 0, -500]}>
        <Stars radius={300} depth={60} count={20000} factor={7} saturation={0} fade speed={1} />
        <mesh position={[0, 0, -100]}>
            <sphereGeometry args={[40, 64, 64]} />
            <meshStandardMaterial 
                color="#050505" 
                emissive="#df4418" 
                emissiveIntensity={0.2} 
                roughness={0}
                metalness={1}
            />
        </mesh>
    </group>
);

// --- CORE ENGINE ---

const CameraRig = ({ scroll }) => {
    const cameraRef = useRef();

    useFrame((state) => {
        if (!cameraRef.current) return;
        
        // 1. Z-DEPTH ARCHITECTURE
        // Hero: 0-25%, Projects: 25-50%, Skills: 50-75%, Blog: 75-100%
        // We map 0-1 scroll to 15 to -500 Z
        const targetZ = 15 - (scroll * 600);
        
        // Easing for "Warp Drive" feel
        const spring = scroll > 0.95 ? 0.02 : 0.05;
        cameraRef.current.position.z = THREE.MathUtils.lerp(cameraRef.current.position.z, targetZ, spring);
        
        // 2. DYNAMIC FOV (Speed Stretching)
        // FOV increases drastically during section transitions to simulate Warp Speed
        const isTransitioning = 
            (scroll > 0.18 && scroll < 0.32) || 
            (scroll > 0.43 && scroll < 0.57) || 
            (scroll > 0.68 && scroll < 0.82);

        const targetFOV = 45 + (scroll * 15) + (isTransitioning ? 40 : 0);
        cameraRef.current.fov = THREE.MathUtils.lerp(cameraRef.current.fov, targetFOV, 0.06);
        cameraRef.current.updateProjectionMatrix();

        // 3. MOTION TRACKING
        cameraRef.current.position.x = THREE.MathUtils.lerp(cameraRef.current.position.x, state.mouse.x * 5, 0.05);
        cameraRef.current.position.y = THREE.MathUtils.lerp(cameraRef.current.position.y, state.mouse.y * 5, 0.05);
        
        // 4. PERSPECTIVE TILT
        cameraRef.current.rotation.z = THREE.MathUtils.lerp(cameraRef.current.rotation.z, scroll * Math.PI * 1.5, 0.01);
        
        cameraRef.current.lookAt(0, 0, targetZ - 100);
    });

    return <PerspectiveCamera ref={cameraRef} makeDefault fov={45} />;
};

const HyperScene = ({ scroll = 0 }) => {
    return (
        <div className="fixed top-0 left-0 w-full h-full -z-10 bg-[#050505]">
            <Canvas dpr={[1, 2]} gl={{ antialias: false, logarithmicDepthBuffer: true }}>
                <color attach="background" args={['#050505']} />
                
                <CameraRig scroll={scroll} />
                <ambientLight intensity={0.2} />
                <pointLight position={[20, 20, 20]} intensity={1} color="#df4418" />
                
                <fog attach="fog" args={['#050505', 10, 150]} />

                {/* Environment Zones */}
                <HeroZone />
                <ProjectsZone />
                <SkillsZone />
                <BlogZone />

                <Environment preset="night" />

                {/* SUPER GLOW SYSTEM */}
                <EffectComposer disableNormalPass>
                    <Bloom 
                        intensity={1.5} 
                        luminanceThreshold={0.1} 
                        luminanceSmoothing={0.9} 
                        mipmapBlur 
                    />
                    <Noise opacity={0.05} />
                    <Vignette eskil={false} offset={0.1} darkness={1.1} />
                    <ChromaticAberration offset={[0.002, 0.002]} />
                </EffectComposer>
            </Canvas>
        </div>
    );
};

export default HyperScene;
