'use client'

import * as THREE from 'three'
import { shaderMaterial } from '@react-three/drei'
import { extend } from '@react-three/fiber'

const FlashlightShader = shaderMaterial(
  {
    uMouse: new THREE.Vector2(0.5, 0.5),
    uRadius: 0.22,
    uIntensity: 0.85,
    uTime: 0,
  },
  /* glsl */ `
    varying vec2 vUv;
    varying float vDist;
    uniform vec2 uMouse;
    uniform float uRadius;

    void main() {
      vUv = uv;
      float dist = distance(uv, uMouse);
      vDist = dist;

      vec3 pos = position;
      float bulge = smoothstep(uRadius, 0.0, dist) * 0.08;
      pos.z += bulge;

      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
  /* glsl */ `
    varying vec2 vUv;
    varying float vDist;
    uniform vec2 uMouse;
    uniform float uRadius;
    uniform float uIntensity;
    uniform float uTime;

    void main() {
      float dist = distance(vUv, uMouse);

      float inner = smoothstep(0.0, uRadius * 0.55, dist);
      float outer = smoothstep(uRadius * 0.55, uRadius, dist);
      float mask = inner * (1.0 - outer) + (1.0 - outer) * 0.35;

      float softMask = 1.0 - smoothstep(uRadius * 0.5, uRadius, dist);

      vec3 darkColor = vec3(0.03, 0.02, 0.015);

      float shimmer = sin(dist * 30.0 - uTime * 2.0) * 0.03;
      vec3 litColor = mix(darkColor, vec3(0.95, 0.88, 0.78), softMask * uIntensity + shimmer);

      float glowEdge = smoothstep(uRadius, uRadius * 0.85, dist);
      litColor += vec3(0.25, 0.15, 0.06) * glowEdge * 0.35;

      float alpha = 1.0 - softMask * (uIntensity - 0.05);

      gl_FragColor = vec4(litColor, alpha);
    }
  `
)

extend({ FlashlightShader })

export { FlashlightShader }
