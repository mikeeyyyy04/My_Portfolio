import { useEffect, useRef } from 'react';
import * as THREE from 'three';

type ImmersiveSceneProps = {
  activeSection: string;
  isDarkMode: boolean;
};

const SECTION_KEYS = ['home', 'about', 'skills', 'projects', 'experience', 'contact'];
const SECTION_DISTANCE = 3.1;

const palettes = {
  light: {
    clear: '#f4f7f4',
    points: ['#0f766e', '#e11d48', '#f59e0b'],
    portals: ['#0f766e', '#7c2d12', '#be123c', '#047857', '#b45309', '#4338ca'],
    ribbon: ['#0f766e', '#e11d48', '#f59e0b'],
    portrait: '#ffffff',
  },
  dark: {
    clear: '#07090c',
    points: ['#34d399', '#fb7185', '#fbbf24'],
    portals: ['#34d399', '#fb7185', '#fbbf24', '#38bdf8', '#f97316', '#a7f3d0'],
    ribbon: ['#34d399', '#fb7185', '#fbbf24'],
    portrait: '#eafff8',
  },
};

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));

const createParticleLayer = (count: number, color: string, size: number) => {
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const verticalSpan = SECTION_DISTANCE * (SECTION_KEYS.length - 1) + 8;

  for (let index = 0; index < count; index += 1) {
    const stride = index * 3;
    const radius = 2.2 + Math.random() * 5.4;
    const angle = Math.random() * Math.PI * 2;
    positions[stride] = Math.cos(angle) * radius + (Math.random() - 0.5) * 1.4;
    positions[stride + 1] = 3.4 - Math.random() * verticalSpan;
    positions[stride + 2] = -1.2 - Math.random() * 8.6;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const material = new THREE.PointsMaterial({
    color,
    size,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.34,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  return new THREE.Points(geometry, material);
};

const createRibbon = (color: string, phase: number) => {
  const points: THREE.Vector3[] = [];
  const verticalSpan = SECTION_DISTANCE * (SECTION_KEYS.length - 1) + 5;

  for (let index = 0; index < 88; index += 1) {
    const t = index / 87;
    points.push(
      new THREE.Vector3(
        Math.sin(t * 8 + phase) * 3.2,
        2.4 - t * verticalSpan,
        -2.6 + Math.cos(t * 6.2 + phase) * 0.8,
      ),
    );
  }

  const curve = new THREE.CatmullRomCurve3(points);
  const geometry = new THREE.TubeGeometry(curve, 180, 0.018, 8, false);
  const material = new THREE.MeshBasicMaterial({
    color,
    transparent: true,
    opacity: 0.42,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  return new THREE.Mesh(geometry, material);
};

const disposeScene = (scene: THREE.Scene) => {
  scene.traverse(object => {
    const maybeMesh = object as THREE.Mesh | THREE.Points;
    maybeMesh.geometry?.dispose();

    const material = maybeMesh.material;
    if (Array.isArray(material)) {
      material.forEach(item => item.dispose());
    } else {
      material?.dispose();
    }
  });
};

export default function ImmersiveScene({ activeSection, isDarkMode }: ImmersiveSceneProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const propsRef = useRef({ activeSection, isDarkMode });
  propsRef.current = { activeSection, isDarkMode };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const isCompact = window.innerWidth < 760;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(44, 1, 0.1, 90);
    let renderer: THREE.WebGLRenderer;

    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
      });
    } catch (error) {
      console.warn('[ImmersiveScene] WebGL renderer creation failed; falling back to CSS depth.', error);
      container.classList.add('is-static');
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isCompact ? 1.15 : 1.45));
    renderer.setClearColor(new THREE.Color(palettes.dark.clear), 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.className = 'immersive-canvas';
    renderer.domElement.setAttribute('data-scene', 'scroll-world');
    container.appendChild(renderer.domElement);

    const root = new THREE.Group();
    scene.add(root);

    const palette = propsRef.current.isDarkMode ? palettes.dark : palettes.light;
    const particles = [
      createParticleLayer(isCompact ? 360 : 860, palette.points[0], isCompact ? 0.026 : 0.022),
      createParticleLayer(isCompact ? 220 : 520, palette.points[1], isCompact ? 0.02 : 0.016),
      createParticleLayer(isCompact ? 180 : 420, palette.points[2], isCompact ? 0.018 : 0.014),
    ];
    particles.forEach(layer => root.add(layer));

    const ribbons = palette.ribbon.map((color, index) => createRibbon(color, index * 1.8));
    ribbons.forEach((ribbon, index) => {
      ribbon.rotation.z = index * 0.36;
      root.add(ribbon);
    });

    const portalMeshes = SECTION_KEYS.map((key, index) => {
      const material = new THREE.MeshBasicMaterial({
        color: palette.portals[index],
        transparent: true,
        opacity: 0.22,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      const ring = new THREE.Mesh(new THREE.TorusGeometry(index === 0 ? 1.72 : 1.22, 0.018, 14, 132), material);
      ring.position.set(index % 2 === 0 ? 2.45 : -2.65, -index * SECTION_DISTANCE + 0.22, -2.25 - (index % 3) * 0.38);
      ring.rotation.set(index % 2 === 0 ? 0.22 : -0.16, index % 2 === 0 ? -0.42 : 0.42, index * 0.24);
      ring.userData.sectionKey = key;
      root.add(ring);
      return { ring, material, index };
    });

    const focusMeshes = SECTION_KEYS.map((_, index) => {
      const material = new THREE.MeshStandardMaterial({
        color: palette.portals[index],
        emissive: palette.portals[index],
        emissiveIntensity: 0.32,
        roughness: 0.36,
        metalness: 0.28,
        transparent: true,
        opacity: 0.68,
        wireframe: true,
      });
      const geometry = index % 2 === 0 ? new THREE.IcosahedronGeometry(0.44, 1) : new THREE.OctahedronGeometry(0.5, 1);
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(index % 2 === 0 ? -2.2 : 2.35, -index * SECTION_DISTANCE - 0.36, -1.5);
      root.add(mesh);
      return { mesh, material, index };
    });

    const ambient = new THREE.AmbientLight(0xffffff, 1.6);
    const keyLight = new THREE.PointLight(0xffffff, 3.4, 16);
    keyLight.position.set(0, 2, 3.5);
    scene.add(ambient, keyLight);

    const pointer = new THREE.Vector2(0, 0);
    const targetPointer = new THREE.Vector2(0, 0);
    const clock = new THREE.Clock();
    let targetScroll = 0;
    let smoothScroll = 0;
    let frameId = 0;

    const updateScroll = () => {
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      targetScroll = clamp01(window.scrollY / maxScroll);
    };

    const updateSize = () => {
      const width = container.clientWidth || window.innerWidth;
      const height = container.clientHeight || window.innerHeight;
      renderer.setSize(width, height, false);
      camera.aspect = width / Math.max(1, height);
      camera.updateProjectionMatrix();
    };

    const updatePointer = (event: PointerEvent) => {
      targetPointer.x = (event.clientX / window.innerWidth - 0.5) * 2;
      targetPointer.y = -(event.clientY / window.innerHeight - 0.5) * 2;
    };

    window.addEventListener('scroll', updateScroll, { passive: true });
    window.addEventListener('resize', updateSize);
    window.addEventListener('pointermove', updatePointer, { passive: true });
    updateScroll();
    updateSize();

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();
      const motionFactor = prefersReducedMotion.matches ? 1 : 0.075;
      smoothScroll += (targetScroll - smoothScroll) * motionFactor;
      pointer.lerp(targetPointer, 0.055);

      const current = propsRef.current;
      const currentPalette = current.isDarkMode ? palettes.dark : palettes.light;
      const sectionFloat = smoothScroll * (SECTION_KEYS.length - 1);
      const cameraY = -sectionFloat * SECTION_DISTANCE;

      renderer.setClearColor(new THREE.Color(currentPalette.clear), 0);
      camera.position.x = pointer.x * (isCompact ? 0.22 : 0.58) + Math.sin(smoothScroll * Math.PI * 2) * 0.12;
      camera.position.y = cameraY + 0.12 + pointer.y * 0.2;
      camera.position.z = THREE.MathUtils.lerp(isCompact ? 8.4 : 7.4, isCompact ? 6.8 : 5.8, smoothScroll);
      camera.lookAt(pointer.x * 0.26, cameraY - 0.22, -2.35);

      root.rotation.y = pointer.x * 0.08 + Math.sin(elapsed * 0.18) * 0.025;
      root.position.x = -pointer.x * 0.12;

      particles.forEach((layer, index) => {
        const material = layer.material as THREE.PointsMaterial;
        material.color.lerp(new THREE.Color(currentPalette.points[index]), 0.04);
        layer.rotation.y = elapsed * (0.012 + index * 0.006) + smoothScroll * (0.28 + index * 0.08);
        layer.position.y = Math.sin(elapsed * 0.16 + index) * 0.08;
      });

      ribbons.forEach((ribbon, index) => {
        const material = ribbon.material as THREE.MeshBasicMaterial;
        material.color.lerp(new THREE.Color(currentPalette.ribbon[index]), 0.04);
        ribbon.rotation.y = Math.sin(elapsed * 0.13 + index) * 0.09 + smoothScroll * 0.2;
        ribbon.rotation.z += prefersReducedMotion.matches ? 0 : 0.0007 * (index + 1);
      });

      portalMeshes.forEach(({ ring, material, index }) => {
        const closeness = clamp01(1 - Math.abs(sectionFloat - index) * 0.72);
        material.color.lerp(new THREE.Color(currentPalette.portals[index]), 0.06);
        material.opacity = 0.14 + closeness * 0.44;
        ring.scale.setScalar(1 + closeness * 0.24 + Math.sin(elapsed * 1.1 + index) * 0.025);
        ring.rotation.z = index * 0.24 + elapsed * (0.035 + index * 0.004) + smoothScroll * 0.6;
      });

      focusMeshes.forEach(({ mesh, material, index }) => {
        const closeness = clamp01(1 - Math.abs(sectionFloat - index) * 0.86);
        material.color.lerp(new THREE.Color(currentPalette.portals[index]), 0.06);
        material.emissive.lerp(new THREE.Color(currentPalette.portals[index]), 0.06);
        material.opacity = 0.22 + closeness * 0.56;
        mesh.rotation.x = elapsed * 0.18 + index;
        mesh.rotation.y = elapsed * 0.26 + smoothScroll * 1.4;
        mesh.scale.setScalar(0.86 + closeness * 0.36);
      });

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('scroll', updateScroll);
      window.removeEventListener('resize', updateSize);
      window.removeEventListener('pointermove', updatePointer);
      disposeScene(scene);
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={containerRef} className="immersive-scene" aria-hidden="true" />;
}
