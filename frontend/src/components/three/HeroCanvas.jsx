import React, { useRef, useMemo, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Text, CameraControls, Icosahedron, Html, MeshReflectorMaterial, Sparkles } from '@react-three/drei'
import { EffectComposer, Bloom, Noise } from '@react-three/postprocessing'
import * as THREE from 'three'

// The interactive nodes as sharp, brutalist geometries (Icosahedron wireframes)
const NavNode = ({ position, label, onClick, isHovered, onHover, speed }) => {
    const meshRef = useRef()

    useFrame((state, delta) => {
        if (meshRef.current) {
            // Mechanical levitation and rigid rotation
            meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed) * 0.2
            meshRef.current.rotation.x += delta * (speed * 0.8)
            meshRef.current.rotation.y += delta * speed
        }
    })

    return (
        <group position={position}>
            <group ref={meshRef}>
                <Icosahedron
                    args={[1.2, 1]}
                    onClick={(e) => { e.stopPropagation(); onClick() }}
                    onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = 'pointer'; onHover(true) }}
                    onPointerOut={(e) => { e.stopPropagation(); document.body.style.cursor = 'auto'; onHover(false) }}
                >
                    {/* Dark metallic wireframe material */}
                    <meshStandardMaterial
                        color={isHovered ? '#ff0000' : '#444444'}
                        emissive={isHovered ? '#ff0000' : '#000000'}
                        emissiveIntensity={isHovered ? 2 : 0}
                        wireframe={true}
                        roughness={0.2}
                        metalness={0.8}
                    />
                </Icosahedron>
                <Icosahedron args={[0.8, 0]}>
                    <meshStandardMaterial
                        color="#111111"
                        roughness={0.1}
                        metalness={1.0}
                    />
                </Icosahedron>
            </group>

            <Text
                position={[0, -2.5, 0]}
                fontSize={0.9}
                color={isHovered ? '#ffffff' : '#555555'} // Stark white on hover
                anchorX="center"
                anchorY="middle"
                outlineWidth={isHovered ? 0.04 : 0.02}
                outlineColor={isHovered ? '#ff0000' : '#000000'} // Red glow
            >
                {label}
            </Text>

            {isHovered && (
                <Html position={[0, 2.8, 0]} center zIndexRange={[100, 0]}>
                    <div className="bg-black/80 backdrop-blur-md border border-red-600 px-4 py-1 text-sm font-display text-white shadow-[0_0_15px_rgba(255,0,0,0.6)] whitespace-nowrap uppercase tracking-widest">
                        ACCESS: {label}
                    </div>
                </Html>
            )}
        </group>
    )
}

const BackgroundArt = () => {
    return (
        <group position={[0, 5, -30]}>
            {/* Massive Ghost Typography for heavy architectural depth */}
            <Text
                fontSize={24}
                color="#000000" // Invisible fill
                anchorX="center"
                anchorY="middle"
                outlineWidth={0.2}
                outlineColor="#333333" // Grey wireframe
                fillOpacity={0}
                fontWeight="bold"
            >
                YADEV 3D
            </Text>
            <Text
                position={[0, -20, -10]}
                fontSize={28}
                color="#000000"
                anchorX="center"
                anchorY="middle"
                outlineWidth={0.3}
                outlineColor="#ff0000" // Red shadow deeper down
                fillOpacity={0}
                fontWeight="bold"
            >
                SYSTEM
            </Text>
        </group>
    )
}

const Constellation = ({ setActiveOverlay }) => {
    const [hoveredNode, setHoveredNode] = useState(null)

    // Layout configuration
    const nodes = [
        { id: 'about', label: 'IDENTITY', position: [-8, 2, -10], speed: 1.2 },
        { id: 'projects', label: 'WORKS', position: [0, 4, -15], speed: 0.8 },
        { id: 'skills', label: 'ARSENAL', position: [8, 0, -12], speed: 1.5 },
        { id: 'journey', label: 'TIMELINE', position: [-5, -4, -8], speed: 0.5 },
        { id: 'media', label: 'ARCHIVES', position: [6, -5, -14], speed: 1.1 },
        { id: 'blog', label: 'TRANSMISSIONS', position: [0, -6, -5], speed: 1.4 }
    ]

    return (
        <group>
            {/* The Adidas Chile 20 Wet Floor Reflection */}
            <mesh position={[0, -10, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[200, 200]} />
                <MeshReflectorMaterial
                    blur={[400, 100]} // Blur ground reflections (width, height)
                    resolution={1024} // Reflectivity resolution
                    mixBlur={1} // How much blur mixes with surface roughness
                    mixStrength={15} // Strength of the reflections
                    roughness={1}
                    depthScale={1.2} // Scale the depth factor (0 = no depth)
                    minDepthThreshold={0.4} // Lower edge for the depthTexture interpolation
                    maxDepthThreshold={1.4} // Upper edge for the depthTexture interpolation
                    color="#050505"
                    metalness={0.8}
                    mirror={1} // Mirror perfection, 0 = no mirror, 1 = perfect mirror
                />
            </mesh>

            <BackgroundArt />

            {nodes.map((node) => (
                <NavNode
                    key={node.id}
                    position={node.position}
                    label={node.label}
                    speed={node.speed}
                    isHovered={hoveredNode === node.id}
                    onHover={(state) => setHoveredNode(state ? node.id : null)}
                    onClick={() => setActiveOverlay(node.id)}
                />
            ))}

            {/* Cinematic Spotlights */}
            <ambientLight intensity={0.2} color="#ffffff" />
            <spotLight position={[10, 20, 10]} angle={0.3} penumbra={1} intensity={200} color="#ffffff" castShadow />
            <spotLight position={[-10, 15, -10]} angle={0.4} penumbra={1} intensity={300} color="#ff0000" castShadow />
            <pointLight position={[0, -5, -15]} intensity={100} color="#ffffff" distance={30} />

            {/* Gritty floating debris (Ash/Embers) instead of Sparkles */}
            <Sparkles count={800} scale={40} size={15} speed={0.2} opacity={0.5} color="#444444" noise={1} />
            <Sparkles count={200} scale={30} size={25} speed={0.5} opacity={0.8} color="#ff0000" noise={2} />
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
            smoothTime={0.8} // Smooth sweeping transitons
        />
    )
}

export const HeroCanvas = ({ activeOverlay, setActiveOverlay }) => {
    return (
        // Pure Black Base Void
        <div className="absolute inset-0 w-full h-full bg-[#000000] select-none">
            <Canvas camera={{ position: [0, 0, 15], fov: 60 }} gl={{ antialias: false, toneMapping: THREE.ReinhardToneMapping }}>
                {/* Deep pitch black fog mask */}
                <fog attach="fog" args={['#000000', 10, 50]} />

                <Constellation setActiveOverlay={setActiveOverlay} />
                <CameraManager activeOverlay={activeOverlay} />

                {/* Urban Brutalism Cinematic Post-Processing */}
                <EffectComposer>
                    <Noise opacity={0.05} />
                    <Bloom luminanceThreshold={1} mipmapBlur intensity={1.5} />
                </EffectComposer>
            </Canvas>
        </div>
    )
}
