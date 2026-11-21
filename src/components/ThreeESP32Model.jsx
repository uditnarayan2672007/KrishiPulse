import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RotateCw, Zap, Eye, Maximize2 } from 'lucide-react';

export const ThreeESP32Model = ({ isPumpActive = false, moisture = 35 }) => {
  const mountRef = useRef(null);
  const [isRotating, setIsRotating] = useState(true);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    const width = currentMount.clientWidth;
    const height = currentMount.clientHeight;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(5, 4, 6);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    currentMount.appendChild(renderer.domElement);

    // 2. Lighting (Chrome specular highlights & Laser Crimson accents)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xe2e8f0, 1.8);
    dirLight.position.set(5, 10, 7);
    scene.add(dirLight);

    const crimsonLight = new THREE.PointLight(0xff003b, isPumpActive ? 3.5 : 1.2, 10);
    crimsonLight.position.set(0, 1.5, 0);
    scene.add(crimsonLight);

    // 3. Materials
    const obsidianMat = new THREE.MeshStandardMaterial({
      color: 0x0a0c10,
      metalness: 0.9,
      roughness: 0.2,
    });

    const pcbMat = new THREE.MeshStandardMaterial({
      color: 0x111318,
      metalness: 0.7,
      roughness: 0.3,
    });

    const chromeMat = new THREE.MeshStandardMaterial({
      color: 0xf1f5f9,
      metalness: 0.95,
      roughness: 0.1,
    });

    const chipMat = new THREE.MeshStandardMaterial({
      color: 0x1a1c23,
      metalness: 0.8,
      roughness: 0.4,
    });

    const laserMat = new THREE.MeshBasicMaterial({
      color: 0xff003b,
    });

    const copperMat = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      metalness: 0.9,
      roughness: 0.2,
    });

    // 4. Hierarchical 3D Model Group
    const modelGroup = new THREE.Group();
    scene.add(modelGroup);

    // Platform Base
    const baseGeo = new THREE.CylinderGeometry(3.2, 3.4, 0.3, 48);
    const baseMesh = new THREE.Mesh(baseGeo, obsidianMat);
    baseMesh.position.y = -1.2;
    modelGroup.add(baseMesh);

    // Glowing Laser Ring on Base
    const ringGeo = new THREE.RingGeometry(3.1, 3.25, 48);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xff003b,
      side: THREE.DoubleSide,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = -Math.PI / 2;
    ringMesh.position.y = -1.04;
    modelGroup.add(ringMesh);

    // ESP32 PCB Board
    const pcbGeo = new THREE.BoxGeometry(2.4, 0.08, 3.6);
    const pcbMesh = new THREE.Mesh(pcbGeo, pcbMat);
    pcbMesh.position.set(-0.8, -0.4, 0);
    modelGroup.add(pcbMesh);

    // ESP32 Metal RF Shield Canister
    const rfGeo = new THREE.BoxGeometry(1.2, 0.18, 1.4);
    const rfMesh = new THREE.Mesh(rfGeo, chromeMat);
    rfMesh.position.set(-0.8, -0.28, -0.6);
    modelGroup.add(rfMesh);

    // ESP32 Chip Laser Logo
    const logoGeo = new THREE.BoxGeometry(0.3, 0.02, 0.3);
    const logoMesh = new THREE.Mesh(logoGeo, laserMat);
    logoMesh.position.set(-0.8, -0.18, -0.6);
    modelGroup.add(logoMesh);

    // Microcontroller Header Pins (Chrome Silver)
    for (let i = -1.5; i <= 1.5; i += 0.2) {
      const pinGeo = new THREE.BoxGeometry(0.06, 0.3, 0.06);
      const pin1 = new THREE.Mesh(pinGeo, chromeMat);
      pin1.position.set(-1.9, -0.25, i);
      modelGroup.add(pin1);

      const pin2 = new THREE.Mesh(pinGeo, chromeMat);
      pin2.position.set(0.3, -0.25, i);
      modelGroup.add(pin2);
    }

    // Capacitive Soil Moisture Sensor Blade
    const probeGroup = new THREE.Group();
    probeGroup.position.set(1.5, -0.3, 0);
    modelGroup.add(probeGroup);

    const probeBodyGeo = new THREE.BoxGeometry(0.8, 0.05, 2.8);
    const probeMesh = new THREE.Mesh(probeBodyGeo, pcbMat);
    probeGroup.add(probeMesh);

    // Copper Sensing Traces on Probe
    const traceGeo = new THREE.BoxGeometry(0.55, 0.06, 1.8);
    const traceMesh = new THREE.Mesh(traceGeo, copperMat);
    traceMesh.position.set(0, 0.01, 0.3);
    probeGroup.add(traceMesh);

    // Connecting Sensor Ribbon Cable (Laser Crimson & Chrome)
    const curve = new THREE.CubicBezierCurve3(
      new THREE.Vector3(-0.6, -0.3, 1.2),
      new THREE.Vector3(-0.2, 0.6, 1.4),
      new THREE.Vector3(1.0, 0.6, 0.5),
      new THREE.Vector3(1.5, -0.2, -0.8)
    );
    const tubeGeo = new THREE.TubeGeometry(curve, 32, 0.04, 8, false);
    const tubeMat = new THREE.MeshStandardMaterial({
      color: 0xff003b,
      metalness: 0.5,
      roughness: 0.2,
    });
    const tubeMesh = new THREE.Mesh(tubeGeo, tubeMat);
    modelGroup.add(tubeMesh);

    // 5. Water Flow Particle System (Pumping Animation)
    const particleCount = 70;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 1.5;
      particlePositions[i * 3 + 1] = Math.random() * 2 - 0.5;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 1.5;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    const particleMat = new THREE.PointsMaterial({
      color: isPumpActive ? 0xff003b : 0x0ea5e9,
      size: isPumpActive ? 0.09 : 0.04,
      transparent: true,
      opacity: isPumpActive ? 0.85 : 0.3,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    particles.position.set(1.5, 0, 0);
    modelGroup.add(particles);

    // 6. Interactive Mouse Drag Orbit Controls
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
      modelGroup.rotation.x = Math.max(-0.6, Math.min(0.6, modelGroup.rotation.x));

      prevMousePos = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    currentMount.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // 7. Animation Loop
    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (!isDragging && isRotating) {
        modelGroup.rotation.y += 0.007;
      }

      // Animate flowing water particles when pump is running
      const positions = particleGeo.attributes.position.array;
      for (let i = 0; i < particleCount; i++) {
        const speed = isPumpActive ? 0.035 : 0.008;
        positions[i * 3 + 1] -= speed;
        if (positions[i * 3 + 1] < -0.8) {
          positions[i * 3 + 1] = 1.4;
        }
      }
      particleGeo.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };
    animate();

    // 8. Resize Handler
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
  }, [isPumpActive, isRotating]);

  return (
    <div className="relative w-full h-full min-h-[300px] flex items-center justify-center select-none overflow-hidden rounded-2xl bg-gradient-to-b from-obsidian-950 via-obsidian-900 to-obsidian-950 border border-chrome-800">
      {/* 3D Canvas Mount Point */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Cyber HUD Overlays on 3D Model */}
      <div className="absolute top-4 left-4 flex items-center gap-2 pointer-events-none">
        <span className="h-2 w-2 rounded-full bg-crimson-laser animate-ping"></span>
        <span className="text-[10px] font-mono font-bold text-white uppercase tracking-widest bg-obsidian-950/80 px-2.5 py-1 rounded-lg border border-chrome-800 backdrop-blur-md">
          3D HARDWARE TWIN // ESP32 + ADC PROBE
        </span>
      </div>

      <div className="absolute top-4 right-4 flex items-center gap-2">
        <button
          onClick={() => setIsRotating(!isRotating)}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold border transition backdrop-blur-md ${
            isRotating
              ? 'bg-crimson-950/70 border-crimson-laser/60 text-crimson-laser'
              : 'bg-obsidian-950/80 border-chrome-800 text-chrome-400 hover:text-white'
          }`}
          title="Toggle Auto-Rotation"
        >
          <RotateCw className={`h-3 w-3 ${isRotating ? 'animate-spin' : ''}`} />
          <span>{isRotating ? 'ORBIT ON' : 'PAUSED'}</span>
        </button>
      </div>

      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-[10px] font-mono text-chrome-500 bg-obsidian-950/80 p-2.5 rounded-xl border border-obsidian-750 backdrop-blur-md pointer-events-none">
        <span>INTERACTION: DRAG TO ROTATE 360°</span>
        <span className={isPumpActive ? 'text-crimson-laser font-bold animate-pulse' : 'text-chrome-300'}>
          {isPumpActive ? '⚡ 3D WATER FLOW ACTIVE' : 'ACTUATOR IDLE'}
        </span>
      </div>
    </div>
  );
};
