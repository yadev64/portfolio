import React, { useRef, useMemo, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Text, CameraControls, Sphere, Html, MeshDistortMaterial, Environment, Sparkles } from '@react-three/drei'
import * as THREE from 'three'

// The interactive nodes as fluidic crystal blobs
const NavNode = ({ position, label, onClick, color, isHovered, onHover, speed }) => {
    const meshRef = useRef()

    useFrame((state, delta) => {
        if (meshRef.current) {
            // Fluid levitation on the mesh ONLY, keeping text stationary
            meshRef.current.position.y = Math.sin(state.clock.elapsedTime * speed) * 0.5
            meshRef.current.rotation.x += delta * (speed * 0.5)
            meshRef.current.rotation.y += delta * speed
            // Breathing scale for extra fluid vibe
            const t = state.clock.elapsedTime * speed
            meshRef.current.scale.set(
                1 + Math.sin(t * 1.5) * 0.1,
                1 + Math.sin(t * 2.0) * 0.1,
                1 + Math.cos(t * 1.2) * 0.1
            )
        }
    })

    return (
        <group position={position}>
            <group ref={meshRef}>
                <Sphere
                    args={[1.5, 64, 64]}
                    onClick={(e) => { e.stopPropagation(); onClick() }}
                    onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = 'pointer'; onHover(true) }}
                    onPointerOut={(e) => { e.stopPropagation(); document.body.style.cursor = 'auto'; onHover(false) }}
                >
                    {/* True 3D Fluid Blob Material */}
                    <MeshDistortMaterial
                        color={color}
                        emissive={color}
                        emissiveIntensity={isHovered ? 0.8 : 0.2}
                        distort={isHovered ? 0.6 : 0.4}
                        speed={isHovered ? 4 : 2}
                        roughness={0.1}
                        metalness={0.9}
                        clearcoat={1}
                        clearcoatRoughness={0.1}
                    />
                </Sphere>
            </group>

            <Text
                position={[0, -2.5, 0]}
                fontSize={0.9}
                color={isHovered ? '#6B21A8' : '#8B8A95'} // Dark purple on hover
                anchorX="center"
                anchorY="middle"
                outlineWidth={isHovered ? 0.02 : 0}
                outlineColor="#D4AF37" // Gold edge
            >
                {label}
            </Text>

            {isHovered && (
                <Html position={[0, 2.8, 0]} center zIndexRange={[100, 0]}>
                    <div className="bg-white/80 backdrop-blur-md border border-[#D4AF37] px-4 py-1 rounded-full text-sm font-display text-[#6B21A8] shadow-[0_0_20px_rgba(212,175,55,0.4)] whitespace-nowrap uppercase tracking-widest">
                        Access {label}
                    </div>
                </Html>
            )}
        </group>
    )
}

const BackgroundArt = () => {
    const ref = useRef()
    useFrame((state, delta) => {
        if (ref.current) {
            ref.current.rotation.x += delta * 0.05
            ref.current.rotation.y += delta * 0.1
            ref.current.rotation.z -= delta * 0.05
        }
    })
    return (
        <group ref={ref} position={[0, 0, -40]}>
            <mesh>
                <torusKnotGeometry args={[20, 3, 256, 64]} />
                <meshStandardMaterial
                    color="#D4AF37"
                    metalness={0.8}
                    roughness={0.3}
                    emissive="#6B21A8"
                    emissiveIntensity={0.2}
                />
            </mesh>
        </group>
    )
}

const Constellation = ({ setActiveOverlay }) => {
    const [hoveredNode, setHoveredNode] = useState(null)

    // Vibrant crystal colors 
    const nodes = [
        { id: 'about', label: 'Identity', position: [-8, 2, -10], color: '#FF1493', speed: 1.2 }, // Ruby Pink
        { id: 'projects', label: 'Works', position: [0, 4, -15], color: '#00FFFF', speed: 0.8 }, // Sapphire Cyan
        { id: 'skills', label: 'Arsenal', position: [8, 0, -12], color: '#9932CC', speed: 1.5 }, // Amethyst Purple
        { id: 'journey', label: 'Timeline', position: [-5, -4, -8], color: '#00FA9A', speed: 0.5 }, // Emerald Green
        { id: 'media', label: 'Archives', position: [6, -5, -14], color: '#FFD700', speed: 1.1 }, // Topaz Gold
        { id: 'blog', label: 'Transmissions', position: [0, -6, -5], color: '#FF4500', speed: 1.4 } // Opal Orange
    ]

    return (
        <group>
            <BackgroundArt />

            {nodes.map((node) => (
                <NavNode
                    key={node.id}
                    position={node.position}
                    label={node.label}
                    color={node.color}
                    speed={node.speed}
                    isHovered={hoveredNode === node.id}
                    onHover={(state) => setHoveredNode(state ? node.id : null)}
                    onClick={() => setActiveOverlay(node.id)}
                />
            ))}

            {/* Ambient Pearl Environment */}
            <Environment preset="studio" />
            <ambientLight intensity={0.5} color="#ffffff" />

            {/* Gold and Purple edge lighting for metallic reflections */}
            <directionalLight position={[10, 10, 5]} intensity={2.5} color="#D4AF37" />
            <directionalLight position={[-10, -10, -5]} intensity={2.5} color="#6B21A8" />
            <pointLight position={[0, 0, 0]} intensity={1.5} color="#ffffff" distance={20} />

            {/* Ambient Dust Motes instead of Stars */}
            <Sparkles count={500} scale={40} size={10} speed={0.4} opacity={0.6} color="#D4AF37" />
            <Sparkles count={300} scale={30} size={12} speed={0.2} opacity={0.4} color="#6B21A8" />
        </group>
    )
}

// Camera controller component
const CameraManager = ({ activeOverlay }) => {
    const controlsRef = useRef()
    const { camera } = useThree()

    const viewMap = useMemo(() => ({
        hub: { pos: [0, 0, 15], target: [0, 0, 0] },
        about: { pos: [-8, 2, -6], target: [-8, 2, -10] },
        projects: { pos: [0, 4, -11], target: [0, 4, -15] },
        skills: { pos: [8, 0, -8], target: [8, 0, -12] },
        journey: { pos: [-5, -4, -4], target: [-5, -4, -8] },
        media: { pos: [6, -5, -10], target: [6, -5, -14] },
        blog: { pos: [0, -6, -1], target: [0, -6, -5] }
    }), [])

    useFrame(() => {
        if (controlsRef.current) {
            const view = viewMap[activeOverlay || 'hub']
            controlsRef.current.setLookAt(
                view.pos[0], view.pos[1], view.pos[2],
                view.target[0], view.target[1], view.target[2],
                true
            )
        }
    })

    return (
        <CameraControls
            ref={controlsRef}
            makeDefault
            minDistance={2}
            maxDistance={40}
            mouseButtons={{
                left: 1, // ACTION.ROTATE
                middle: 8, // ACTION.DOLLY
                right: 2, // ACTION.TRUCK
                wheel: 8 // ACTION.DOLLY
            }}
            touches={{
                one: 32, // ACTION.TOUCH_ROTATE
                two: 1024 // ACTION.TOUCH_DOLLY_TRUCK
            }}
            smoothTime={0.8}
        />
    )
}

export const HeroCanvas = ({ activeOverlay, setActiveOverlay }) => {
    return (
        // Metallic Pearl background base
        <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-[#e0e5ec] to-[#f4f7f6] select-none">
            <Canvas camera={{ position: [0, 0, 15], fov: 60 }}>
                {/* Pearl/Silver fog */}
                <fog attach="fog" args={['#e0e5ec', 15, 60]} />

                <Constellation setActiveOverlay={setActiveOverlay} />
                <CameraManager activeOverlay={activeOverlay} />

            </Canvas>
        </div>
    )
}
