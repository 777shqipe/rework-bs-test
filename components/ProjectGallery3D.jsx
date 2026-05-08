'use client';

import * as THREE from 'three';
import { useRef, useState, useMemo, useEffect } from 'react';
import { Canvas, useFrame, extend } from '@react-three/fiber';
import { Environment, ScrollControls, useScroll } from '@react-three/drei';
import { easing } from 'maath';

/* ===========================================================
   CATEGORY COLORS
   =========================================================== */
const catColors = {
  management: { accent: '#c4a76c', wash: '#1e3a5f' },
  website: { accent: '#8ab4c4', wash: '#0d3d3d' },
  marketing: { accent: '#c48a8a', wash: '#4a1a2c' },
  crm: { accent: '#8ac4a7', wash: '#1e3d2f' },
};

/* ===========================================================
   CANVAS TEXTURE GENERATOR
   =========================================================== */
function roundRectPath(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function drawProjectCard(project, t) {
  const W = 1024;
  const H = 720;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');

  const cat = catColors[project.categoryKey] || catColors.website;
  const accent = cat.accent;
  const wash = cat.wash;

  ctx.clearRect(0, 0, W, H);

  /* shadow */
  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,0.45)';
  ctx.shadowBlur = 40;
  ctx.shadowOffsetY = 16;
  roundRectPath(ctx, 8, 8, W - 16, H - 16, 28);
  ctx.fillStyle = '#1f1713';
  ctx.fill();
  ctx.restore();

  /* card body */
  roundRectPath(ctx, 8, 8, W - 16, H - 16, 28);
  const grad = ctx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, wash);
  grad.addColorStop(0.7, wash);
  grad.addColorStop(1, '#2d2019');
  ctx.fillStyle = grad;
  ctx.fill();

  /* inner border */
  ctx.save();
  roundRectPath(ctx, 8, 8, W - 16, H - 16, 28);
  ctx.strokeStyle = 'rgba(166, 159, 147, 0.22)';
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.restore();

  /* top glow line */
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(40, 10);
  ctx.lineTo(W - 40, 10);
  ctx.strokeStyle = accent + '55';
  ctx.lineWidth = 2;
  ctx.shadowColor = accent;
  ctx.shadowBlur = 12;
  ctx.stroke();
  ctx.restore();

  const PAD = 60;
  let y = 70;

  /* category badge */
  const catText = t(`projects.categories.${project.categoryKey}`);
  ctx.font = '700 32px Inter, system-ui, sans-serif';
  const catW = ctx.measureText(catText).width + 48;
  roundRectPath(ctx, PAD, y, catW, 60, 30);
  ctx.fillStyle = accent + '18';
  ctx.fill();
  ctx.strokeStyle = accent + '35';
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.fillStyle = accent;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(catText, PAD + catW / 2, y + 30);

  /* year */
  ctx.textAlign = 'right';
  ctx.textBaseline = 'top';
  ctx.font = '900 180px Inter, system-ui, sans-serif';
  ctx.fillStyle = accent + '14';
  ctx.fillText(project.year, W - PAD, y - 22);

  /* soft atmospheric highlights */
  ctx.save();
  ctx.globalAlpha = 0.24;
  const glowA = ctx.createRadialGradient(W * 0.82, H * 0.16, 10, W * 0.82, H * 0.16, 330);
  glowA.addColorStop(0, accent + '66');
  glowA.addColorStop(1, accent + '00');
  ctx.fillStyle = glowA;
  ctx.beginPath();
  ctx.arc(W * 0.82, H * 0.16, 330, 0, Math.PI * 2);
  ctx.fill();
  const glowB = ctx.createRadialGradient(W * 0.18, H * 0.84, 10, W * 0.18, H * 0.84, 280);
  glowB.addColorStop(0, '#f0e8dc22');
  glowB.addColorStop(1, '#f0e8dc00');
  ctx.fillStyle = glowB;
  ctx.beginPath();
  ctx.arc(W * 0.18, H * 0.84, 280, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  /* name */
  y = 145;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillStyle = '#f0e8dc';
  ctx.font = '900 72px Inter, system-ui, sans-serif';

  const maxW = W - PAD * 2;
  const words = project.n.split(' ');
  let line = '';
  let nameLines = 0;
  for (let i = 0; i < words.length; i++) {
    const test = line + words[i] + ' ';
    if (ctx.measureText(test).width > maxW && i > 0) {
      ctx.fillText(line, PAD, y);
      line = words[i] + ' ';
      y += 78;
      nameLines++;
    } else {
      line = test;
    }
  }
  ctx.fillText(line, PAD, y);
  y += 78;
  nameLines++;

  /* separator */
  y += 24;
  ctx.beginPath();
  ctx.moveTo(PAD, y);
  ctx.lineTo(W - PAD, y);
  ctx.strokeStyle = 'rgba(166, 159, 147, 0.18)';
  ctx.lineWidth = 1;
  ctx.stroke();

  /* description */
  y += 22;
  ctx.fillStyle = '#a89880';
  ctx.font = '500 34px Inter, system-ui, sans-serif';
  const descWords = project.desc.split(' ');
  line = '';
  let lines = 0;
  const descStartY = y;
  for (let i = 0; i < descWords.length; i++) {
    const test = line + descWords[i] + ' ';
    if (ctx.measureText(test).width > maxW && i > 0) {
      ctx.fillText(line, PAD, y);
      line = descWords[i] + ' ';
      y += 48;
      lines++;
      if (lines >= 10) break;
    } else {
      line = test;
    }
  }
  if (lines < 10) {
    ctx.fillText(line, PAD, y);
    lines++;
  }
  y = descStartY + Math.max(lines, 5) * 48;

  /* tags */
  y += 56;
  let tagX = PAD;
  const tagH = 48;
  ctx.font = '700 22px Inter, system-ui, sans-serif';
  project.tags.slice(0, 8).forEach((tag) => {
    const tagW = ctx.measureText(tag).width + 28;
    if (tagX + tagW > W - PAD) { tagX = PAD; y += tagH + 8; }
    roundRectPath(ctx, tagX, y, tagW, tagH, 24);
    ctx.fillStyle = accent + '18';
    ctx.fill();
    ctx.strokeStyle = accent + '40';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.fillStyle = accent;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(tag, tagX + tagW / 2, y + tagH / 2);
    tagX += tagW + 6;
  });

  return canvas;
}

function drawBannerTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 4096;
  canvas.height = 160;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = 'rgba(244, 239, 231, 0.5)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'rgba(24, 17, 13, 0.7)';
  ctx.font = '900 32px Inter, system-ui, sans-serif';
  ctx.textBaseline = 'middle';

  const text = 'BACK SOFTWARE • ';
  let x = 0;
  while (x < canvas.width + 240) {
    ctx.fillText(text, x, canvas.height / 2 + 1);
    x += ctx.measureText(text).width;
  }

  return canvas;
}

/* ===========================================================
   CUSTOM GEOMETRY & MATERIAL
   =========================================================== */
class BentPlaneGeometry extends THREE.PlaneGeometry {
  constructor(radius, ...args) {
    super(...args);
    const p = this.parameters;
    const hw = p.width * 0.5;
    const a = new THREE.Vector2(-hw, 0);
    const b = new THREE.Vector2(0, radius);
    const c = new THREE.Vector2(hw, 0);
    const ab = new THREE.Vector2().subVectors(a, b);
    const bc = new THREE.Vector2().subVectors(b, c);
    const ac = new THREE.Vector2().subVectors(a, c);
    const r = (ab.length() * bc.length() * ac.length()) / (2 * Math.abs(ab.cross(ac)));
    const center = new THREE.Vector2(0, radius - r);
    const baseV = new THREE.Vector2().subVectors(a, center);
    const baseAngle = baseV.angle() - Math.PI * 0.5;
    const arc = baseAngle * 2;
    const uv = this.attributes.uv;
    const pos = this.attributes.position;
    const mainV = new THREE.Vector2();
    for (let i = 0; i < uv.count; i++) {
      const uvRatio = 1 - uv.getX(i);
      const y = pos.getY(i);
      mainV.copy(c).rotateAround(center, arc * uvRatio);
      pos.setXYZ(i, mainV.x, y, -mainV.y);
    }
    pos.needsUpdate = true;
  }
}

class MeshSineMaterial extends THREE.MeshBasicMaterial {
  constructor(parameters = {}) {
    super(parameters);
    this.setValues(parameters);
    this.time = { value: 0 };
  }
  onBeforeCompile(shader) {
    shader.uniforms.time = this.time;
    shader.vertexShader = `uniform float time;\n${shader.vertexShader}`;
    shader.vertexShader = shader.vertexShader.replace(
      '#include <begin_vertex>',
      `vec3 transformed = vec3(position.x, position.y + sin(time + uv.x * PI * 4.0) / 4.0, position.z);`
    );
  }
}

extend({ MeshSineMaterial, BentPlaneGeometry });

/* ===========================================================
   SCENE COMPONENTS
   =========================================================== */
function Rig(props) {
  const ref = useRef();
  const scroll = useScroll();
  useFrame((state, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y = -scroll.offset * (Math.PI * 4);
    state.events.update();
    easing.damp3(state.camera.position, [-state.pointer.x * 2, state.pointer.y + 1.5, 10], 0.3, delta);
    state.camera.lookAt(0, 0, 0);
  });
  return <group ref={ref} {...props} />;
}

function ProjectCard({ texture, ...props }) {
  const ref = useRef();
  const [hovered, hover] = useState(false);
  const pointerOver = (e) => { e.stopPropagation(); hover(true); };
  const pointerOut = () => hover(false);

  useFrame((state, delta) => {
    if (!ref.current) return;
    easing.damp3(ref.current.scale, hovered ? 1.15 : 1, 0.1, delta);
  });

  return (
    <mesh ref={ref} {...props} onPointerOver={pointerOver} onPointerOut={pointerOut}>
      <bentPlaneGeometry args={[0.1, 1, 1, 20, 20]} />
      <meshBasicMaterial map={texture} transparent side={THREE.DoubleSide} toneMapped={false} />
    </mesh>
  );
}

function ProjectCarousel({ projects, textures, radius = 2.18 }) {
  const count = Math.min(projects.length, textures.length);
  return Array.from({ length: count }, (_, i) => (
    <ProjectCard
      key={projects[i].key}
      texture={textures[i]}
      position={[
        Math.sin((i / count) * Math.PI * 2) * radius,
        0.4,
        Math.cos((i / count) * Math.PI * 2) * radius,
      ]}
      rotation={[0, Math.PI + (i / count) * Math.PI * 2, 0]}
    />
  ));
}

function Banner(props) {
  const ref = useRef();
  const texture = useMemo(() => {
    const canvas = drawBannerTexture();
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.needsUpdate = true;
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    return tex;
  }, []);
  const scroll = useScroll();
  useEffect(() => () => texture.dispose(), [texture]);
  useFrame((state, delta) => {
    if (!ref.current) return;
    ref.current.material.time.value += Math.abs(scroll.delta) * 4;
    ref.current.material.map.offset.x += delta / 30;
  });
  return (
    <mesh ref={ref} {...props}>
      <cylinderGeometry args={[1.6, 1.6, 0.112, 128, 16, true]} />
      <meshSineMaterial map={texture} map-anisotropy={16} map-repeat={[1, 1]} side={THREE.DoubleSide} toneMapped={false} />
    </mesh>
  );
}

/* ===========================================================
   MAIN EXPORT
   =========================================================== */
export default function ProjectGallery3D({ projects, t }) {
  const featuredProjects = useMemo(() => (projects || []).slice(0, 8), [projects]);

  const textures = useMemo(() => {
    if (typeof window === 'undefined' || featuredProjects.length === 0) return [];
    return featuredProjects.map((p) => {
      const canvas = drawProjectCard(p, t);
      const tex = new THREE.CanvasTexture(canvas);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.needsUpdate = true;
      tex.minFilter = THREE.LinearFilter;
      tex.magFilter = THREE.LinearFilter;
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      tex.repeat.set(-1, 1);
      tex.offset.set(1, 0);
      return tex;
    });
  }, [featuredProjects, t]);

  useEffect(() => () => {
    textures.forEach((texture) => texture.dispose());
  }, [textures]);

  const hasData = textures.length > 0;

  return (
    <div className="relative w-full" style={{ height: 'clamp(420px, 60vh, 720px)' }}>
      <Canvas
        camera={{ position: [0, 0, 100], fov: 15 }}
        style={{ width: '100%', height: '100%', touchAction: 'none' }}
        gl={{ antialias: true, alpha: true }}
      >
        {hasData && (
          <>
            <fog attach="fog" args={['#2a1e16', 40, 120]} />
            <ScrollControls pages={8} infinite>
              <Rig rotation={[0, 0, 0.15]} scale={1.2}>
                <ProjectCarousel projects={featuredProjects} textures={textures} />
              </Rig>
              <Banner position={[0, 0.22, 0]} scale={1.2} />
            </ScrollControls>
            <Environment preset="dawn" background={false} blur={0.5} />
          </>
        )}
      </Canvas>

      <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#d4cabb]/60">
        Scrolla per esplorare
      </div>
    </div>
  );
}
