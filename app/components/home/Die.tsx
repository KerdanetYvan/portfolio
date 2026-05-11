'use client';
import { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';
import { useRouter } from 'next/navigation';
import type { ThreeEvent } from '@react-three/fiber';
import { ROLES } from '../../../config/roles';

/*
 * Regular tetrahedron — vertices normalised on sphere of radius r.
 * Three.js TetrahedronGeometry(r, 0) vertex order:
 *   V0=(1,1,1)  V1=(-1,-1,1)  V2=(-1,1,-1)  V3=(1,-1,-1)  (scaled by r)
 *
 * Face normals (Three.js order):
 *   F0: V2,V1,V0  →  (-1, 1, 1)/√3
 *   F1: V0,V3,V2  →  ( 1, 1,-1)/√3
 *   F2: V1,V3,V0  →  ( 1,-1, 1)/√3
 *   F3: V2,V3,V1  →  (-1,-1,-1)/√3
 */
const RADIUS = 1.6;
const LABEL_DIST = 1.85;

const RAW_NORMALS = [
  new THREE.Vector3(-1,  1,  1).normalize(),
  new THREE.Vector3( 1,  1, -1).normalize(),
  new THREE.Vector3( 1, -1,  1).normalize(),
  new THREE.Vector3(-1, -1, -1).normalize(),
];

const LABEL_POSITIONS = RAW_NORMALS.map((n) => n.clone().multiplyScalar(LABEL_DIST));

interface SceneProps {
  reducedMotion: boolean;
}

function Scene({ reducedMotion }: SceneProps) {
  const groupRef   = useRef<THREE.Group>(null);
  const spinning   = useRef(!reducedMotion);
  const labelRefs  = useRef<(HTMLDivElement | null)[]>([]);
  const router     = useRouter();
  const [active, setActive] = useState<number | null>(null);

  const edges = useMemo(
    () => new THREE.EdgesGeometry(new THREE.TetrahedronGeometry(RADIUS, 0)),
    []
  );

  useFrame(({ camera }, delta) => {
    if (!groupRef.current) return;

    if (spinning.current) {
      groupRef.current.rotation.y += delta * 0.45;
      groupRef.current.rotation.x += delta * 0.18;
    }

    /* Show/hide each label based on whether its face normal points toward the camera */
    const quat = groupRef.current.quaternion;
    RAW_NORMALS.forEach((normal, i) => {
      const worldNormal = normal.clone().applyQuaternion(quat);
      const worldPos    = LABEL_POSITIONS[i].clone().applyQuaternion(quat);
      const toCam       = camera.position.clone().sub(worldPos).normalize();
      const el          = labelRefs.current[i];
      if (el) el.style.opacity = worldNormal.dot(toCam) > 0.05 ? '1' : '0';
    });
  });

  const onStart = useCallback(() => { spinning.current = false; }, []);
  const onEnd   = useCallback(() => {
    if (!reducedMotion) spinning.current = true;
  }, [reducedMotion]);

  const handleClick = useCallback((e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    if (e.faceIndex == null) return;
    const role = ROLES[e.faceIndex % ROLES.length];
    if (role) {
      spinning.current = false;
      router.push(role.href);
    }
  }, [router]);

  const handlePointerOver = useCallback(() => {
    spinning.current = false;
    document.body.style.cursor = 'pointer';
  }, []);

  const handlePointerMove = useCallback((e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setActive(e.faceIndex ?? null);
  }, []);

  const handlePointerOut = useCallback(() => {
    setActive(null);
    if (!reducedMotion) spinning.current = true;
    document.body.style.cursor = '';
  }, [reducedMotion]);

  return (
    <>
      <ambientLight intensity={0.6} />
      <pointLight position={[4, 4, 4]} intensity={1.2} />
      <pointLight position={[-4, -2, -4]} intensity={0.4} color="#00D26A" />

      <group ref={groupRef}>
        {/* Clean wireframe via EdgesGeometry — no diagonal artefacts */}
        <lineSegments geometry={edges}>
          <lineBasicMaterial color="#00D26A" transparent opacity={0.85} />
        </lineSegments>

        {/* Invisible solid mesh for pointer/click picking */}
        <mesh
          onClick={handleClick}
          onPointerOver={handlePointerOver}
          onPointerMove={handlePointerMove}
          onPointerOut={handlePointerOut}
        >
          <tetrahedronGeometry args={[RADIUS, 0]} />
          <meshStandardMaterial
            transparent
            opacity={0}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>

        {/* HTML labels — inside group so they orbit with the die */}
        {LABEL_POSITIONS.map((pos, i) => {
          const role = ROLES[i];
          if (!role) return null;
          return (
            <Html
              key={role.id}
              position={[pos.x, pos.y, pos.z]}
              center
              occlude={false}
              style={{ pointerEvents: 'none' }}
            >
              {/* wrapper div — opacity updated directly in useFrame, no re-render */}
              <div
                ref={(el) => { labelRefs.current[i] = el; }}
                style={{ opacity: 0, transition: 'opacity 0.18s ease' }}
              >
                <span
                  className={`
                    font-mono text-[11px] px-2 py-1 rounded border whitespace-nowrap select-none
                    transition-all duration-150
                    ${active === i
                      ? 'bg-[#00D26A] text-[#0a0a0a] border-[#00D26A]'
                      : 'bg-[#111111]/80 text-[#ededed] border-[#262626]'}
                  `}
                >
                  {role.label}
                </span>
              </div>
            </Html>
          );
        })}
      </group>

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        onStart={onStart}
        onEnd={onEnd}
      />
    </>
  );
}

function DieFallback() {
  return (
    <div aria-hidden="true" className="w-full h-full flex items-center justify-center">
      <div
        className="border border-[#00D26A] w-32 h-32 rotate-45"
        style={{ boxShadow: '0 0 12px color-mix(in srgb, #00D26A 30%, transparent)' }}
      />
    </div>
  );
}

export default function Die() {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isMobile, setIsMobile]           = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    setIsMobile(window.innerWidth < 768);
  }, []);

  if (isMobile) return <DieFallback />;

  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: 'transparent' }}
      aria-label="Dé tétraédrique représentant mes différentes casquettes"
    >
      <Scene reducedMotion={reducedMotion} />
    </Canvas>
  );
}
