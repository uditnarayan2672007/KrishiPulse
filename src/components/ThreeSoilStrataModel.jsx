
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Layers, RotateCw, Droplets } from 'lucide-react';

export const ThreeSoilStrataModel = ({ moisture = 35 }) => {
  const mountRef = useRef(null);
  const [isRotating, setIsRotating] = useState(true);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    const width = currentMount.clientWidth;
    const height = currentMount.clientHeight;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.set(4.5, 3.8, 5.5);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    currentMount.appendChild(renderer.domElement);

    // 2. Lights
    const amb = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(amb);

    const dir = new THREE.DirectionalLight(0xffffff, 1.6);
    dir.position.set(6, 12, 6);
    scene.add(dir);

    const crimsonGlow = new THREE.PointLight(0xff003b, 2.0, 8);
    crimsonGlow.position.set(0, 0.5, 0);
    scene.add(crimsonGlow);

    // 3. Materials
    const topsoilMat = new THREE.MeshStandardMaterial({
      color: 0x1f242d,
      roughness: 0.8,
      metalness: 0.1,
    });

    const rootZoneMat = new THREE.MeshStandardMaterial({
      color: 0x161821,
      roughness: 0.7,
      metalness: 0.2,
    });

    const subsoilMat = new THREE.MeshStandardMaterial({
      color: 0x0c0d12,
      roughness: 0.9,
      metalness: 0.3,
    });

    const waterMat = new THREE.MeshPhysicalMaterial({
      color: 0xff003b,
      transparent: true,
      opacity: 0.45,
      roughness: 0.1,
      transmission: 0.6,
      thickness: 1.2,
    });

    const rootMat = new THREE.MeshStandardMaterial({
      color: 0xf1f5f9,
      roughness: 0.4,
    });

    const plantMat = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      roughness: 0.3,
    });

    // 4. Model Group
    const modelGroup = new THREE.Group();
    scene.add(modelGroup);

    // 3D Isometric Soil Block Layers
    // Layer 1: Subsoil (Bottom)
    const subGeo = new THREE.BoxGeometry(2.4, 0.8, 2.4);
    const subMesh = new THREE.Mesh(subGeo, subsoilMat);
    subMesh.position.y = -1.0;
    modelGroup.add(subMesh);

    // Layer 2: Root Zone (Middle)
    const rootGeo = new THREE.BoxGeometry(2.4, 0.8, 2.4);
    const rootMesh = new THREE.Mesh(rootGeo, rootZoneMat);
    rootMesh.position.y = -0.2;
    modelGroup.add(rootMesh);

    // Layer 3: Topsoil (Top)
    const topGeo = new THREE.BoxGeometry(2.4, 0.6, 2.4);
    const topMesh = new THREE.Mesh(topGeo, topsoilMat);
    topMesh.position.y = 0.5;
    modelGroup.add(topMesh);

    // Dynamic 3D Moisture Volumetric Wavefront (Height scales with moisture %)
    const moistureHeight = Math.max(0.2, (moisture / 100) * 1.8);
    const waterGeo = new THREE.BoxGeometry(2.42, moistureHeight, 2.42);
    const waterMesh = new THREE.Mesh(waterGeo, waterMat);
    waterMesh.position.y = -1.3 + moistureHeight / 2;
    modelGroup.add(waterMesh);

    // 3D Plant Crop Stem & Leaves on Top
    const stemGeo = new THREE.CylinderGeometry(0.04, 0.06, 1.2, 12);
    const stemMesh = new THREE.Mesh(stemGeo, plantMat);
    stemMesh.position.set(0, 1.4, 0);
    modelGroup.add(stemMesh);

    // Leaves
    const leafGeo = new THREE.ConeGeometry(0.18, 0.5, 4);
    for (let i = 0; i < 4; i++) {
      const leaf = new THREE.Mesh(leafGeo, plantMat);
      leaf.position.set(0, 1.4 + i * 0.15, 0);
      leaf.rotation.z = (i % 2 === 0 ? 1 : -1) * 0.7;
      leaf.rotation.y = (i * Math.PI) / 2;
      modelGroup.add(leaf);
    }

    // 3D Root Network inside Soil
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI) / 3;
      const rootCurve = new THREE.CubicBezierCurve3(
        new THREE.Vector3(0, 0.8, 0),
        new THREE.Vector3(Math.cos(angle) * 0.4, 0.2, Math.sin(angle) * 0.4),
        new THREE.Vector3(Math.cos(angle) * 0.8, -0.6, Math.sin(angle) * 0.8),
        new THREE.Vector3(Math.cos(angle) * 0.9, -1.1, Math.sin(angle) * 0.9)
      );
      const rootTubeGeo = new THREE.TubeGeometry(rootCurve, 16, 0.02, 6, false);
      const rootTube = new THREE.Mesh(rootTubeGeo, rootMat);
      modelGroup.add(rootTube);
    }

    // Interactive Drag
    let isDragging = false;
    let prevMousePos = { x: 0, y: 0 };

    const onMouseDown = (e) => {
      isDragging = true;
      prevMousePos = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMousePos.x;
      const deltaY = e.clientY - prevMousePos.y;

      modelGroup.rotation.y += deltaX * 0.01;
      modelGroup.rotation.x += deltaY * 0.01;
      modelGroup.rotation.x = Math.max(-0.5, Math.min(0.5, modelGroup.rotation.x));

      prevMousePos = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    currentMount.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Animation Loop
    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (!isDragging && isRotating) {
        modelGroup.rotation.y += 0.006;
      }

      renderer.render(scene, camera);
    };
    animate();

    // Resize Handler
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
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      currentMount.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      if (currentMount.contains(renderer.domElement)) {
        currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [moisture, isRotating]);

  return (
    <div className="relative w-full h-full min-h-[300px] flex items-center justify-center select-none overflow-hidden rounded-2xl bg-gradient-to-b from-obsidian-950 via-obsidian-900 to-obsidian-950 border border-chrome-800">
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Cyber HUD Overlay */}
      <div className="absolute top-4 left-4 flex items-center gap-2 pointer-events-none">
        <span className="h-2 w-2 rounded-full bg-crimson-laser animate-ping"></span>
        <span className="text-[10px] font-mono font-bold text-white uppercase tracking-widest bg-obsidian-950/80 px-2.5 py-1 rounded-lg border border-chrome-800 backdrop-blur-md">
          3D ROOT STRATA // MOISTURE PENETRATION
        </span>
      </div>

      <div className="absolute top-4 right-4 flex items-center gap-2">
        <button
          onClick={() => setIsRotating(!isRotating)}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold border transition backdrop-blur-md ${isRotating
              ? 'bg-crimson-950/70 border-crimson-laser/60 text-crimson-laser'
              : 'bg-obsidian-950/80 border-chrome-800 text-chrome-400 hover:text-white'
            }`}
        >
          <RotateCw className={`h-3 w-3 ${isRotating ? 'animate-spin' : ''}`} />
          <span>{isRotating ? 'ORBIT' : 'PAUSED'}</span>
        </button>
      </div>

      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-[10px] font-mono text-chrome-500 bg-obsidian-950/80 p-2.5 rounded-xl border border-obsidian-750 backdrop-blur-md pointer-events-none">
        <span>STRATA: TOPSOIL • ROOT ZONE • SUBSOIL</span>
        <span className="text-crimson-laser font-bold">SATURATION: {moisture}%</span>
      </div>
    </div>
  );
};
