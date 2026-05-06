'use client'

import { useRef, useMemo, useState, useCallback } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { FlashlightShader } from './FlashlightShader'
import * as THREE from 'three'

function FlashlightPlane({ mouseX, mouseY }) {
  const materialRef = useRef()
  const target = useRef(new THREE.Vector2(0.5, 0.5))
  const current = useRef(new THREE.Vector2(0.5, 0.5))

  const uniforms = useMemo(() => ({
    uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    uRadius: { value: 0.22 },
    uIntensity: { value: 0.85 },
    uTime: { value: 0 },
  }), [])

  useFrame((state) => {
    target.current.set(mouseX, mouseY)
    current.current.lerp(target.current, 0.06)
    uniforms.uMouse.value.copy(current.current)
    uniforms.uTime.value = state.clock.elapsedTime
  })

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={materialRef}
        transparent
        depthWrite={false}
        depthTest={false}
        uniforms={uniforms}
        vertexShader={FlashlightShader.vertexShader}
        fragmentShader={FlashlightShader.fragmentShader}
      />
    </mesh>
  )
}

export default function HeroFlashlightReveal() {
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 })

  const handlePointerMove = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setMouse({
      x: (e.clientX - rect.left) / rect.width,
      y: 1 - (e.clientY - rect.top) / rect.height,
    })
  }, [])

  const handlePointerLeave = useCallback(() => {
    setMouse({ x: 0.5, y: 0.5 })
  }, [])

  return (
    <div
      className="absolute inset-0"
      style={{ zIndex: 5 }}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <Canvas
        style={{ pointerEvents: 'none', position: 'absolute', inset: 0 }}
        gl={{
          alpha: true,
          premultipliedAlpha: false,
          antialias: false,
          powerPreference: 'high-performance',
        }}
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 1], fov: 45 }}
      >
        <FlashlightPlane mouseX={mouse.x} mouseY={mouse.y} />
      </Canvas>
    </div>
  )
}
