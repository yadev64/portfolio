import React, { useRef, useMemo, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Points, PointMaterial, Text, CameraControls, Sphere, Outlines, Html } from '@react-three/drei'
import * as THREE from 'three'

// The interactive nodes in the galaxy
const NavNode = ({ position, label, onClick, color, isHovered, onHover }) => {
    return (
        <group position={position}>
            <Sphere
                args={[1.5, 32, 32]}
                onClick={(e) => { e.stopPropagation(); onClick() }}
                onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = 'pointer'; onHover(true) }}
                onPointerOut={(e) => { e.stopPropagation(); document.body.style.cursor = 'auto'; onHover(false) }}
            >
                <meshStandardMaterial color={isHovered ? '#ffffff' : color} emissive={color} emissiveIntensity={isHovered ? 1.5 : 0.5} roughness={0.2} metalness={0.8} />
                {isHovered && <Outlines thickness={0.05} color="#ffffff" />}
            </Sphere>

            <Text
                position={[0, -2.5, 0]}
                fontSize={0.8}
                color={isHovered ? '#ffffff' : '#8B8A95'}
                anchorX="center"
                anchorY="middle"
            >
                {label}
            </Text>

            {isHovered && (
                <Html position={[0, 2.5, 0]} center>
                    <div className="bg-bg-card border border-border px-3 py-1 rounded-full text-xs font-mono text-accent-primary animate-pulse whitespace-nowrap">
                        Launch {label}
                    </div>
                </Html>
            )}
        </group>
    )
}

const Constellation = ({ setActiveOverlay }) => {
    const [hoveredNode, setHoveredNode] = useState(null)

    const nodes = [
        { id: 'about', label: 'Identity', position: [-8, 2, -10], color: '#6EF7C4' }, // Mint
        { id: 'projects', label: 'Works', position: [0, 4, -15], color: '#F7A26E' }, // Amber
        { id: 'skills', label: 'Arsenal', position: [8, 0, -12], color: '#A26EF7' }, // Violet
        { id: 'journey', label: 'Timeline', position: [-5, -4, -8], color: '#ffffff' },
        { id: 'media', label: 'Archives', position: [6, -5, -14], color: '#6EF7C4' },
        { id: 'blog', label: 'Transmissions', position: [0, -6, -5], color: '#F7A26E' }
    ]

    return (
        <group>
            {nodes.map((node) => (
                <NavNode
                    key={node.id}
                    position={node.position}
                    label={node.label}
                    color={node.color}
                    isHovered={hoveredNode === node.id}
                    onHover={(state) => setHoveredNode(state ? node.id : null)}
                    onClick={() => setActiveOverlay(node.id)}
                />
            ))}
            {/* Decorative center star (Origin) */}
            <Sphere args={[0.5, 16, 16]} position={[0, 0, 0]}>
                <meshBasicMaterial color="#ffffff" />
            </Sphere>
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 10]} intensity={2} color="#A26EF7" />
            <directionalLight position={[-10, -10, -5]} intensity={1} color="#6EF7C4" />
        </group>
    )
}

// Existing floating particles logic with slight modifications for distance
const FloatingParticles = () => {
    const ref = useRef()

    const count = 3000
    const [positions] = useState(() => {
        const pos = new Float32Array(count * 3)
        for (let i = 0; i < count; i++) {
            // Distribute particles in a large sphere
            const theta = Math.random() * 2 * Math.PI
            const phi = Math.acos((Math.random() * 2) - 1)
            // Range 10 to 60 units away
            const radius = 10 + Math.random() * 50

            pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
            pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
            pos[i * 3 + 2] = radius * Math.cos(phi)
        }
        return pos
    })

    useFrame((state, delta) => {
        if (!ref.current) return
        ref.current.rotation.x -= delta / 50
        ref.current.rotation.y -= delta / 65
    })

    return (
        <group>
            <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
                <PointMaterial transparent color="#8B8A95" size={0.05} sizeAttenuation={true} depthWrite={false} />
            </Points>
        </group>
    )
}

// Camera controller component
const CameraManager = ({ activeOverlay }) => {
    const controlsRef = useRef()
    const { camera } = useThree()

    // Define target coordinates for each section to fly the camera to
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

            // We push the camera very close to the node using camera-controls setLookAt
            controlsRef.current.setLookAt(
                view.pos[0], view.pos[1], view.pos[2],
                view.target[0], view.target[1], view.target[2],
                true // enable transition animation
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
            // Smooth out the movement
            smoothTime={0.8}
        />
    )
}

export const HeroCanvas = ({ activeOverlay, setActiveOverlay }) => {
    return (
        <div className="absolute inset-0 w-full h-full bg-bg-primary select-none">
            <Canvas camera={{ position: [0, 0, 15], fov: 60 }}>
                <color attach="background" args={['#0a0a0f']} />
                <fog attach="fog" args={['#0a0a0f', 15, 60]} />

                <FloatingParticles />
                <Constellation setActiveOverlay={setActiveOverlay} />
                <CameraManager activeOverlay={activeOverlay} />

            </Canvas>
        </div>
    )
}
