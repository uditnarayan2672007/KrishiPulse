import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const ThreeHeroModel = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    const width = currentMount.clientWidth;
    const height = currentMount.clientHeight;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.set(4, 3, 6);
    camera.lookAt(0, 0.4, 0);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    currentMount.appendChild(renderer.domElement);

    // 2. High-End Specular & Neon Lights
    const amb = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(amb);

    const mainLight = new THREE.DirectionalLight(0xffffff, 2.5);
    mainLight.position.set(8, 12, 10);
    scene.add(mainLight);

    const laserLight = new THREE.PointLight(0xff003b, 4.0, 12);
    laserLight.position.set(0, 1.8, 1);
    scene.add(laserLight);

    const backRimLight = new THREE.DirectionalLight(0xe2e8f0, 2.0);
    backRimLight.position.set(-6, 5, -6);
    scene.add(backRimLight);

    // 3. Materials (Chrome, Obsidian, Laser Crimson, Emerald)
    const obsidianPedestal = new THREE.MeshStandardMaterial({
      color: 0x07080b,
      metalness: 0.95,
      roughness: 0.15,
    });

    const chromeSilver = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      metalness: 0.98,
      roughness: 0.08,
    });

    const laserCrimson = new THREE.MeshBasicMaterial({
      color: 0xff003b,
      side: THREE.DoubleSide,
    });

    const plantStemMat = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      metalness: 0.4,
      roughness: 0.2,
    });

    const plantLeafMat = new THREE.MeshPhysicalMaterial({
      color: 0x34d399,
      metalness: 0.1,
      roughness: 0.1,
      transmission: 0.4,
      thickness: 0.8,
      clearcoat: 1.0,
    });

    const glassSoilMat = new THREE.MeshPhysicalMaterial({
      color: 0x1e2430,
      metalness: 0.2,
      roughness: 0.1,
      transmission: 0.85,
      thickness: 2.0,
      transparent: true,
      opacity: 0.65,
    });

    // 4. Main 3D Artwork Composition Group
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // Beveled Obsidian Pedestal
    const pedestalGeo = new THREE.CylinderGeometry(2.2, 2.6, 0.4, 48);
    const pedestalMesh = new THREE.Mesh(pedestalGeo, obsidianPedestal);
    pedestalMesh.position.y = -1.2;
    rootGroup.add(pedestalMesh);

    // Chrome Trim Rim
    const trimGeo = new THREE.TorusGeometry(2.22, 0.05, 16, 64);
    const trimMesh = new THREE.Mesh(trimGeo, chromeSilver);
    trimMesh.rotation.x = Math.PI / 2;
    trimMesh.position.y = -1.0;
    rootGroup.add(trimMesh);

    // Laser Crimson Glowing Ring
    const glowRingGeo = new THREE.RingGeometry(2.28, 2.38, 64);
    const glowRingMesh = new THREE.Mesh(glowRingGeo, laserCrimson);
    glowRingMesh.rotation.x = -Math.PI / 2;
    glowRingMesh.position.y = -0.99;
    rootGroup.add(glowRingMesh);

    // Transparent Volumetric Soil Cube Cutaway (Isometric)
    const cubeGeo = new THREE.BoxGeometry(1.9, 1.3, 1.9);
    const cubeMesh = new THREE.Mesh(cubeGeo, glassSoilMat);
    cubeMesh.position.y = -0.35;
    rootGroup.add(cubeMesh);

    // Wireframe edges on soil block (Chrome Silver)
    const edgesGeo = new THREE.EdgesGeometry(cubeGeo);
    const edgesMat = new THREE.LineBasicMaterial({ color: 0x94a3b8, linewidth: 1.5 });
    const edgesMesh = new THREE.LineSegments(edgesGeo, edgesMat);
    edgesMesh.position.y = -0.35;
    rootGroup.add(edgesMesh);

    // 3D Plant Stem Sprouting Upwards
    const stemCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, -0.4, 0),
      new THREE.Vector3(0.08, 0.3, 0.04),
      new THREE.Vector3(-0.05, 0.9, -0.02),
      new THREE.Vector3(0, 1.5, 0),
    ]);
    const stemGeo = new THREE.TubeGeometry(stemCurve, 32, 0.07, 12, false);
    const stemMesh = new THREE.Mesh(stemGeo, plantStemMat);
    rootGroup.add(stemMesh);

    // High-Resolution 3D Curved Leaves
    const leafGroup = new THREE.Group();
    rootGroup.add(leafGroup);

    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI * 2) / 6;
      const height = 0.5 + i * 0.18;
      const leafShape = new THREE.Shape();
      leafShape.moveTo(0, 0);
      leafShape.quadraticCurveTo(0.2, 0.4, 0.1, 0.8);
      leafShape.quadraticCurveTo(0, 1.0, 0, 1.2);
      leafShape.quadraticCurveTo(-0.05, 0.9, -0.1, 0.7);
      leafShape.quadraticCurveTo(-0.2, 0.3, 0, 0);

      const extrudeSettings = { depth: 0.02, bevelEnabled: true, bevelSegments: 3, steps: 1, bevelSize: 0.01, bevelThickness: 0.01 };
      const leafGeo = new THREE.ExtrudeGeometry(leafShape, extrudeSettings);
      const leafMesh = new THREE.Mesh(leafGeo, plantLeafMat);
      leafMesh.position.set(0, height, 0);
      leafMesh.rotation.y = angle;
      leafMesh.rotation.z = -0.55;
      leafMesh.rotation.x = (i % 2 === 0 ? 0.2 : -0.2);
      leafMesh.scale.set(0.7, 0.7, 0.7);
      leafGroup.add(leafMesh);
    }

    // Floating 3D ESP32 Chip with Chrome Heat-Spreader Hovering nearby
    const chipGroup = new THREE.Group();
    chipGroup.position.set(1.4, 0.4, 0.8);
    rootGroup.add(chipGroup);

    const chipGeo = new THREE.BoxGeometry(0.9, 0.06, 1.2);
    const chipMesh = new THREE.Mesh(chipGeo, obsidianPedestal);
    chipGroup.add(chipMesh);

    const metalCanGeo = new THREE.BoxGeometry(0.5, 0.12, 0.6);
    const metalCanMesh = new THREE.Mesh(metalCanGeo, chromeSilver);
    metalCanMesh.position.y = 0.08;
    chipGroup.add(metalCanMesh);

    // Laser Logo on Chip
    const laserPip = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.02, 0.12), laserCrimson);
    laserPip.position.set(0, 0.15, 0);
    chipGroup.add(laserPip);

    // Laser Scanning Ring (Moves Up and Down the Plant in 3D)
    const scanRingGeo = new THREE.TorusGeometry(1.15, 0.02, 16, 64);
    const scanRingMesh = new THREE.Mesh(scanRingGeo, laserCrimson);
    scanRingMesh.rotation.x = Math.PI / 2;
    scanRingMesh.position.y = 0.5;
    rootGroup.add(scanRingMesh);

    // Floating Holographic Dust Particles
    const dustCount = 80;
    const dustGeo = new THREE.BufferGeometry();
    const dustPositions = new Float32Array(dustCount * 3);

    for (let i = 0; i < dustCount; i++) {
      dustPositions[i * 3] = (Math.random() - 0.5) * 4;
      dustPositions[i * 3 + 1] = Math.random() * 3 - 1;
      dustPositions[i * 3 + 2] = (Math.random() - 0.5) * 4;
    }
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
    const dustMat = new THREE.PointsMaterial({
      color: 0xff003b,
      size: 0.05,
      transparent: true,
      opacity: 0.8,
    });
    const dustParticles = new THREE.Points(dustGeo, dustMat);
    rootGroup.add(dustParticles);

    // 5. Interactive Mouse Parallax Tracking
    let targetRotationX = 0;
    let targetRotationY = 0;
    let currentRotationX = 0;
    let currentRotationY = 0;

    const onMouseMove = (e) => {
      const rect = currentMount.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / height) * 2 - 1);
      targetRotationY = x * 0.6;
      targetRotationX = -y * 0.35;
    };

    window.addEventListener('mousemove', onMouseMove);

    // 6. Animation Loop
    let clock = new THREE.Clock();
    let animationId;

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth parallax interpolation
      currentRotationX += (targetRotationX - currentRotationX) * 0.05;
      currentRotationY += (targetRotationY - currentRotationY) * 0.05;

      rootGroup.rotation.y = currentRotationY + elapsedTime * 0.15;
      rootGroup.rotation.x = currentRotationX;

      // Animate Laser Scanning Ring up and down
      scanRingMesh.position.y = 0.4 + Math.sin(elapsedTime * 2.5) * 0.9;
      scanRingMesh.scale.setScalar(1 + Math.sin(elapsedTime * 5) * 0.04);

      // Floating Chip gentle hovering
      chipGroup.position.y = 0.4 + Math.sin(elapsedTime * 1.8) * 0.12;
      chipGroup.rotation.y = elapsedTime * 0.4;

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!currentMount) return;
      const newW = currentMount.clientWidth;
      const newH = currentMount.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', handleResize);
      if (currentMount.contains(renderer.domElement)) {
        currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-full min-h-[440px] lg:min-h-[520px] flex items-center justify-center select-none">
      {/* Three.js WebGL Canvas */}
      <div ref={mountRef} className="w-full h-full" />

      {/* Floating 3D Cutout Overlay Badge 1 */}
      <div className="absolute top-8 left-6 p-3.5 rounded-2xl bg-obsidian-950/85 border border-crimson-laser/50 shadow-laser-md backdrop-blur-xl pointer-events-none animate-bounce" style={{ animationDuration: '4s' }}>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-crimson-laser animate-ping"></span>
          <span className="text-[10px] font-mono font-bold text-white uppercase tracking-widest">
            3D HOLOGRAPHIC SPECIMEN
          </span>
        </div>
        <div className="text-sm font-black font-mono text-crimson-laser mt-1">
          SOIL WATER ABSORPTION: ACTIVE
        </div>
      </div>

      {/* Floating 3D Cutout Overlay Badge 2 */}
      <div className="absolute bottom-10 right-6 p-4 rounded-2xl bg-obsidian-950/90 border border-chrome-800 shadow-chrome-card backdrop-blur-xl pointer-events-none">
        <div className="flex items-center justify-between gap-4 text-[10px] font-mono text-chrome-400 mb-1">
          <span className="uppercase font-bold">LASER SCATTER REFLECTANCE</span>
          <span className="text-emerald-400 font-bold">98.4%</span>
        </div>
        <div className="text-xs font-black font-mono text-white">
          ROOT PENETRATION // 24.5 CM
        </div>
      </div>
    </div>
  );
};
