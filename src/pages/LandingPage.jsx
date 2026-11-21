import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Flame,
  Droplets,
  Activity,
  Cpu,
  BrainCircuit,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  BarChart3,
  Waves,
  Zap,
  Radio,
  Eye,
  Sliders,
  Sparkles,
  MapPin,
  ExternalLink,
  Layers,
  Crosshair,
  Compass,
  Gauge,
  Wifi,
  ChevronRight,
  Maximize2,
} from 'lucide-react';
import { ThreeHeroModel } from '../components/ThreeHeroModel';

export const LandingPage = () => {
  const [activeTab, setActiveTab] = useState('esp32');

  const cutoutArtwork = [
    {
      id: 'esp32',
      title: 'ESP32 Dual-Core IoT Core',
      tag: 'HARDWARE TIER 01',
      badge: '240 MHz Dual-Core',
      badgeColor: 'border-crimson-laser/40 text-crimson-laser bg-crimson-950/40',
      specs: [
        { label: 'Clock Speed', value: '240 MHz Tensilica' },
        { label: 'Relay Safety', value: '10-Min Max Lease' },
        { label: 'Water Detection', value: 'Float Interlock' },
        { label: 'Polling Cadence', value: '3000 ms HTTPS' },
      ],
      description:
        'Dual-core 32-bit Wi-Fi & BLE microcontroller engineered with fail-safe local float logic, zero-power brownout prevention, and atomic cryptographic command consumption.',
      imageUrl:
        'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
      cutoutAccent: 'Laser-Etched Silicon & Gold Traces',
    },
    {
      id: 'probe',
      title: 'Capacitive Soil Strata Probe',
      tag: 'HARDWARE TIER 02',
      badge: '±1.5% Volumetric',
      badgeColor: 'border-emerald-500/40 text-emerald-400 bg-emerald-950/40',
      specs: [
        { label: 'Dielectric Range', value: '0 - 100% VWC' },
        { label: 'Depth Profile', value: '0 - 45 cm Strata' },
        { label: 'Corrosion Shield', value: 'FR4 Gold Plated' },
        { label: 'Sampling Rate', value: 'Analog ADC 12-Bit' },
      ],
      description:
        'Eliminates galvanic electrolysis degradation with frequency-domain dielectric soil moisture measurement, penetrating deep into root zones without soil salinization interference.',
      imageUrl:
        'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=800&q=80',
      cutoutAccent: 'Dielectric Frequency Waveguide',
    },
    {
      id: 'valve',
      title: 'Motorized Relay & Flowmeter',
      tag: 'HARDWARE TIER 03',
      badge: 'Fail-Safe Normally Closed',
      badgeColor: 'border-cyan-500/40 text-cyan-400 bg-cyan-950/40',
      specs: [
        { label: 'Working Pressure', value: '0.02 - 0.8 MPa' },
        { label: 'Pulse Resolution', value: '450 Pulses/Liter' },
        { label: 'Actuation Time', value: '< 2.5 Seconds' },
        { label: 'Dry-Run Guard', value: 'Automatic Cutoff' },
      ],
      description:
        'Industrial brass motorized valve with optical pulse flow sensor. Guaranteed automatic shutdown if tank empty sensor trips or internet socket connectivity drops.',
      imageUrl:
        'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
      cutoutAccent: 'Pulsed Volumetric Flowmeter',
    },
    {
      id: 'drone',
      title: 'Autonomous Agro-Drone Scout',
      tag: 'HARDWARE TIER 04',
      badge: 'NDVI Multispectral',
      badgeColor: 'border-purple-500/40 text-purple-400 bg-purple-950/40',
      specs: [
        { label: 'Sensor Suite', value: 'RedEdge + Thermal' },
        { label: 'Coverage Area', value: '120 Acres/Flight' },
        { label: 'LiDAR Resolution', value: '2.5 cm Precision' },
        { label: 'ML Synchrony', value: 'Geo-Tiff To Cloud' },
      ],
      description:
        'Autonomous multispectral field scout calculating Normalized Difference Vegetation Index (NDVI) and evaporative plant canopy stress in real-time.',
      imageUrl:
        'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=800&q=80',
      cutoutAccent: 'Canopy Thermal Heat Radiance',
    },
  ];

  const selectedCutout = cutoutArtwork.find((c) => c.id === activeTab) || cutoutArtwork[0];

  return (
    <div className="min-h-screen bg-obsidian-950 text-chrome-200 flex flex-col selection:bg-crimson-laser selection:text-white">
      {/* Top Ambient Cyber Grid Glow */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-25">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-crimson-laser/20 via-transparent to-transparent blur-3xl"></div>
        <div className="absolute inset-0 bg-[radial-gradient(#1e2430_1px,transparent_1px)] [background-size:24px_24px] opacity-40"></div>
      </div>

      {/* Navigation Header */}
      <header className="border-b border-obsidian-800 bg-obsidian-950/80 backdrop-blur-2xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-crimson-laser to-rose-700 p-0.5 shadow-laser-md">
              <div className="flex h-full w-full items-center justify-center rounded-[14px] bg-obsidian-950">
                <Flame className="h-5 w-5 text-crimson-laser animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="font-black text-xl tracking-tight text-white font-mono">KRISHI</span>
                <span className="font-black text-xl tracking-tight text-laser-crimson font-mono">PULSE</span>
              </div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-chrome-500 font-mono">
                PRECISION IOT & ML MATRIX
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
            <nav className="hidden md:flex items-center gap-6 text-xs font-mono font-bold uppercase tracking-wider text-chrome-400">
              <a href="#hero-section" className="hover:text-white transition">Home</a>
              <a href="#3d-cutout-section" className="hover:text-crimson-laser transition flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-crimson-laser" />
                <span>3D Cutout Models</span>
              </a>
              <a href="#architecture" className="hover:text-white transition">Architecture</a>
              <a href="#testimonials" className="hover:text-white transition">Operators</a>
            </nav>

            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="hidden sm:inline-flex text-xs font-bold uppercase tracking-widest text-chrome-300 hover:text-white transition font-mono px-3 py-2"
              >
                Sign In
              </Link>
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-crimson-laser to-rose-700 px-5 py-2.5 text-xs font-black uppercase tracking-wider text-white shadow-laser-md hover:scale-105 transition-all font-mono"
              >
                <Zap className="h-4 w-4" />
                <span>Launch Console</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* HERO SECTION WITH INTERACTIVE 3D WEBGL MODEL & 3D CUTOUT ARTWORK */}
      <section id="hero-section" className="relative z-10 overflow-hidden pt-12 pb-20 lg:pt-16 lg:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-6 text-left space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-crimson-laser/40 bg-obsidian-900/90 px-4 py-1.5 text-xs font-mono font-semibold text-crimson-laser shadow-laser-sm">
                <span className="h-2 w-2 rounded-full bg-crimson-laser animate-ping"></span>
                <span>AUTONOMOUS CYBER-AGRICULTURE PLATFORM</span>
              </div>

              <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight">
                Precision Hydration Driven by <span className="text-laser-crimson">IoT & Scikit-Learn</span>
              </h1>

              <p className="text-base sm:text-lg text-chrome-400 max-w-xl leading-relaxed">
                KrishiPulse empowers commercial crop producers, agronomists, and smart farms to eliminate water wastage, automate pump relays with cryptographic verification, and predict soil moisture stress.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
                <Link
                  to="/dashboard"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-crimson-laser to-rose-700 px-8 py-4 text-xs font-black uppercase tracking-wider text-white shadow-laser-lg hover:scale-105 transition-all font-mono"
                >
                  <Activity className="h-4 w-4" />
                  <span>Enter Live Telemetry Console</span>
                </Link>
                <Link
                  to="/login"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-chrome-700 bg-obsidian-900 px-7 py-4 text-xs font-bold uppercase tracking-wider text-chrome-200 hover:border-crimson-laser hover:text-white transition-all font-mono"
                >
                  <span>1-Click Demo Login</span>
                </Link>
              </div>

              {/* Live Metric Badges */}
              <div className="grid grid-cols-3 gap-3 pt-4">
                <div className="rounded-xl border border-obsidian-800 bg-obsidian-900/70 p-3">
                  <div className="text-[10px] font-mono text-chrome-500 uppercase">Soil Water Saving</div>
                  <div className="text-lg font-black font-mono text-white mt-0.5">38.4%</div>
                  <div className="text-[10px] font-mono text-emerald-400">Measured Yield</div>
                </div>
                <div className="rounded-xl border border-obsidian-800 bg-obsidian-900/70 p-3">
                  <div className="text-[10px] font-mono text-chrome-500 uppercase">Relay Latency</div>
                  <div className="text-lg font-black font-mono text-crimson-laser mt-0.5">&lt; 3.0s</div>
                  <div className="text-[10px] font-mono text-chrome-400">Atomic Poll</div>
                </div>
                <div className="rounded-xl border border-obsidian-800 bg-obsidian-900/70 p-3">
                  <div className="text-[10px] font-mono text-chrome-500 uppercase">ML Accuracy</div>
                  <div className="text-lg font-black font-mono text-white mt-0.5">94.8%</div>
                  <div className="text-[10px] font-mono text-emerald-400">Scikit-Learn</div>
                </div>
              </div>

              {/* Active Operator Crew Badge Stack */}
              <div className="pt-4 border-t border-obsidian-800 flex items-center gap-4">
                <div className="flex -space-x-3">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
                    alt="Ramesh Patel"
                    className="h-10 w-10 rounded-full object-cover border-2 border-obsidian-950 ring-1 ring-crimson-laser"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80"
                    alt="Dr. Sarah Chen"
                    className="h-10 w-10 rounded-full object-cover border-2 border-obsidian-950 ring-1 ring-chrome-600"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
                    alt="Marcus Vance"
                    className="h-10 w-10 rounded-full object-cover border-2 border-obsidian-950 ring-1 ring-chrome-600"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80"
                    alt="Priya Sharma"
                    className="h-10 w-10 rounded-full object-cover border-2 border-obsidian-950 ring-1 ring-chrome-600"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-white">
                    <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
                    <span>1,420+ Field Nodes Deployed</span>
                  </div>
                  <p className="text-[11px] text-chrome-500 font-mono">
                    Monitored by certified agronomists and IoT engineers
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: 3D Holographic Model Centerpiece with Cutout Floating Badges */}
            <div className="lg:col-span-6 relative">
              <div className="relative rounded-3xl overflow-hidden border border-chrome-800/80 shadow-2xl bg-gradient-to-b from-obsidian-900 to-obsidian-950 p-2 group">
                
                {/* Visual Glass Edge Light */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-crimson-laser/60 to-transparent"></div>
                
                {/* 3D WebGL Holographic Agricultural Node */}
                <div className="relative h-[480px] sm:h-[540px] w-full rounded-2xl overflow-hidden bg-obsidian-950">
                  <ThreeHeroModel />

                  {/* Corner Target Reticles */}
                  <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-obsidian-950/80 border border-chrome-800 backdrop-blur-md">
                    <Crosshair className="h-3.5 w-3.5 text-crimson-laser animate-spin" style={{ animationDuration: '8s' }} />
                    <span className="text-[10px] font-mono font-bold text-white uppercase tracking-wider">
                      INTERACTIVE 3D CAD SCAN
                    </span>
                  </div>

                  <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-obsidian-950/80 border border-chrome-800 backdrop-blur-md">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span className="text-[10px] font-mono font-bold text-chrome-300">
                      ROTATE WITH MOUSE
                    </span>
                  </div>
                </div>

                {/* Bottom Status Bar inside Hero Chassis */}
                <div className="mt-2 p-3 rounded-2xl bg-obsidian-950 border border-obsidian-800 flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-crimson-laser"></span>
                    <span className="text-white font-bold">DIGITAL TWIN SYNCHRONIZED</span>
                  </div>
                  <span className="text-chrome-500 font-mono text-[11px]">
                    RENDER: THREE.JS WEBGL 2.0
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3D CUTOUT ARTWORK & HARDWARE EXPLORATION SECTION */}
      <section id="3d-cutout-section" className="relative z-10 py-24 bg-gradient-to-b from-obsidian-950 via-obsidian-900 to-obsidian-950 border-t border-obsidian-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 rounded-full border border-crimson-laser/40 bg-obsidian-900/90 px-4 py-1.5 text-xs font-mono font-semibold text-crimson-laser shadow-laser-sm mb-4">
              <Sparkles className="h-3 w-3 text-crimson-laser" />
              <span>ISOMETRIC 3D CUTOUT ARTWORK</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Hardware Architecture <span className="text-laser-crimson">In High Relief</span>
            </h2>
            <p className="mt-3 text-chrome-400 text-sm sm:text-base leading-relaxed">
              Explore the four physical and algorithmic pillars powering KrishiPulse. Each module is rendered with 3D isometric cutaways, real-time telemetry pinouts, and fail-safe safety interlocks.
            </p>

            {/* Interactive Tab Selectors */}
            <div className="mt-8 flex flex-wrap justify-center gap-2">
              {cutoutArtwork.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all ${
                    activeTab === item.id
                      ? 'bg-crimson-laser text-white shadow-laser-md scale-105'
                      : 'border border-chrome-800 bg-obsidian-900 text-chrome-400 hover:text-white hover:border-chrome-700'
                  }`}
                >
                  {item.title}
                </button>
              ))}
            </div>
          </div>

          {/* Active 3D Cutout Showcase Card */}
          <div className="rounded-3xl border border-chrome-800/80 bg-gradient-to-tr from-obsidian-950 via-obsidian-900 to-obsidian-950 p-6 sm:p-10 shadow-2xl relative overflow-hidden mb-16">
            
            {/* Top Red Laser Beam */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-crimson-laser to-transparent"></div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* 3D Cutout Visual Area with Layered Isometric Projection */}
              <div className="lg:col-span-7 relative group">
                <div className="relative rounded-2xl overflow-hidden border border-chrome-700 bg-obsidian-950 p-3 shadow-2xl">
                  
                  {/* Real Cutout High-Res Photo with Layered Cyber Overlays */}
                  <div className="relative h-72 sm:h-96 w-full rounded-xl overflow-hidden">
                    <img
                      src={selectedCutout.imageUrl}
                      alt={selectedCutout.title}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 brightness-90 contrast-115"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950 via-transparent to-obsidian-950/40"></div>

                    {/* Floating 3D Cutout Badge: Top Left */}
                    <div className="absolute top-4 left-4 p-3 rounded-xl bg-obsidian-950/85 border border-chrome-700 backdrop-blur-xl shadow-lg">
                      <div className="text-[10px] font-mono text-chrome-400 uppercase font-bold">
                        {selectedCutout.tag}
                      </div>
                      <div className="text-sm font-black font-mono text-white mt-0.5">
                        {selectedCutout.title}
                      </div>
                    </div>

                    {/* Floating 3D Cutout Badge: Bottom Right */}
                    <div className="absolute bottom-4 right-4 p-3 rounded-xl bg-obsidian-950/85 border border-crimson-laser/50 backdrop-blur-xl shadow-laser-sm">
                      <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-crimson-laser uppercase">
                        <span className="h-1.5 w-1.5 rounded-full bg-crimson-laser animate-ping"></span>
                        <span>{selectedCutout.cutoutAccent}</span>
                      </div>
                    </div>
                  </div>

                  {/* 3D Isometric Depth Strip */}
                  <div className="mt-3 flex items-center justify-between px-2 text-[10px] font-mono text-chrome-500">
                    <span>3D ISOMETRIC CALIBRATION: ACTIVE</span>
                    <span className="text-crimson-laser font-bold">SPEC: {selectedCutout.badge}</span>
                  </div>
                </div>
              </div>

              {/* Cutout Technical Specifications & Details */}
              <div className="lg:col-span-5 space-y-6 text-left">
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-[11px] font-mono font-bold border ${selectedCutout.badgeColor}`}>
                    {selectedCutout.badge}
                  </span>
                  <span className="text-xs font-mono text-chrome-500">
                    FIELD TESTED // VERIFIED
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {selectedCutout.title}
                </h3>

                <p className="text-sm text-chrome-400 leading-relaxed">
                  {selectedCutout.description}
                </p>

                {/* Specs Grid */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  {selectedCutout.specs.map((s, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-obsidian-950 border border-obsidian-800">
                      <div className="text-[10px] font-mono text-chrome-500 uppercase">{s.label}</div>
                      <div className="text-xs font-black font-mono text-white mt-1">{s.value}</div>
                    </div>
                  ))}
                </div>

                <div className="pt-4 flex items-center gap-4">
                  <Link
                    to="/dashboard"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-crimson-laser to-rose-700 text-xs font-black uppercase tracking-wider text-white shadow-laser-sm hover:scale-105 transition-all font-mono"
                  >
                    <Crosshair className="h-3.5 w-3.5" />
                    <span>View Telemetry Stream</span>
                  </Link>
                  <Link
                    to="/live-sensors"
                    className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-chrome-400 hover:text-white transition"
                  >
                    <span>Inspect Raw ADC</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                </div>

              </div>

            </div>
          </div>

          {/* 4 Isometric 3D Cutout Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {cutoutArtwork.map((item) => (
              <div
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`rounded-2xl border transition-all cursor-pointer p-4 flex flex-col justify-between ${
                  activeTab === item.id
                    ? 'border-crimson-laser bg-obsidian-900 shadow-laser-md scale-[1.02]'
                    : 'border-chrome-800/80 bg-obsidian-900/60 hover:border-chrome-700 hover:bg-obsidian-900'
                }`}
              >
                <div className="relative h-40 w-full rounded-xl overflow-hidden mb-4">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-obsidian-950/80 text-white border border-chrome-800">
                    {item.tag}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-black font-mono text-white mb-1">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-chrome-400 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-obsidian-800 flex items-center justify-between text-[10px] font-mono">
                  <span className="text-crimson-laser font-bold">{item.badge}</span>
                  <span className="text-chrome-400 hover:text-white flex items-center gap-1">
                    <span>Explore</span>
                    <ChevronRight className="h-3 w-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* THREE-TIER HARDWARE & AI TRIFECTA */}
      <section id="architecture" className="py-20 bg-obsidian-950 border-t border-obsidian-800 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-black uppercase tracking-widest text-crimson-laser mb-2 font-mono">
              THE HARDWARE & AI TRIFECTA
            </h2>
            <h3 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              From Soil Chemistry to Cloud Inferences
            </h3>
            <p className="mt-3 text-chrome-400 text-sm">
              Each component is engineered with fail-safe redundancy and enterprise precision.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="rounded-3xl border border-chrome-800 bg-obsidian-900/90 overflow-hidden shadow-2xl hover:border-crimson-laser/50 transition-all hover:-translate-y-1">
              <div className="h-52 w-full overflow-hidden relative">
                <img
                  src="https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=800&q=80"
                  alt="Precision Soil Sensor"
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-obsidian-950/80 text-white border border-chrome-800 backdrop-blur-md">
                  TIER 01: SENSOR PROBES
                </div>
              </div>
              <div className="p-6">
                <h4 className="text-base font-black text-white uppercase font-mono mb-2">
                  Capacitive Hydro-Probing
                </h4>
                <p className="text-xs text-chrome-400 leading-relaxed font-sans mb-4">
                  Corrosion-resistant copper traces eliminate galvanic degradation, providing raw analog-to-digital calibrations with ±1.5% volumetric water accuracy.
                </p>
                <div className="text-[11px] font-mono font-bold text-crimson-laser">
                  ADC VOLUMETRIC MAPPING →
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="rounded-3xl border border-chrome-800 bg-obsidian-900/90 overflow-hidden shadow-2xl hover:border-crimson-laser/50 transition-all hover:-translate-y-1">
              <div className="h-52 w-full overflow-hidden relative">
                <img
                  src="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80"
                  alt="ESP32 Microcontroller"
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-obsidian-950/80 text-white border border-chrome-800 backdrop-blur-md">
                  TIER 02: ESP32 IOT CORE
                </div>
              </div>
              <div className="p-6">
                <h4 className="text-base font-black text-white uppercase font-mono mb-2">
                  Atomic Handshake Relays
                </h4>
                <p className="text-xs text-chrome-400 leading-relaxed font-sans mb-4">
                  Dual-core microcontrollers poll commands every 3 seconds, claim leases atomically, enforce hardware float interlocks, and cut power after 10 minutes.
                </p>
                <div className="text-[11px] font-mono font-bold text-crimson-laser">
                  ZERO DRY-RUN RISK →
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="rounded-3xl border border-chrome-800 bg-obsidian-900/90 overflow-hidden shadow-2xl hover:border-crimson-laser/50 transition-all hover:-translate-y-1">
              <div className="h-52 w-full overflow-hidden relative">
                <img
                  src="https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=800&q=80"
                  alt="Automated Greenhouse"
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-obsidian-950/80 text-white border border-chrome-800 backdrop-blur-md">
                  TIER 03: SCIKIT-LEARN AI
                </div>
              </div>
              <div className="p-6">
                <h4 className="text-base font-black text-white uppercase font-mono mb-2">
                  Random Forest Inferences
                </h4>
                <p className="text-xs text-chrome-400 leading-relaxed font-sans mb-4">
                  Multi-variate regression algorithms predict evapotranspiration curves, balancing ambient vapor deficits against root zone soil water potentials.
                </p>
                <div className="text-[11px] font-mono font-bold text-crimson-laser">
                  94.8% EVALUATED ACCURACY →
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* OPERATOR TESTIMONIALS & CASE STUDIES */}
      <section id="testimonials" className="py-20 border-t border-obsidian-800 bg-obsidian-950 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-black uppercase tracking-widest text-crimson-laser mb-2 font-mono">
              CERTIFIED FIELD OPERATORS
            </h2>
            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Trusted Across Commercial Arable Acreage
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-chrome-800 bg-obsidian-900 p-6 shadow-xl flex flex-col justify-between">
              <p className="text-xs text-chrome-300 leading-relaxed font-sans italic mb-6">
                "KrishiPulse slashed our groundwater diesel pump consumption by 38% across our 300-acre wheat plots. The atomic command leasing means we never have stuck relays."
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-obsidian-800">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                  alt="Ramesh Patel"
                  className="h-10 w-10 rounded-xl object-cover border border-crimson-laser/40"
                />
                <div>
                  <div className="text-xs font-bold text-white font-mono">Ramesh Patel</div>
                  <div className="text-[10px] text-chrome-500 font-mono">Lead Agronomist • Gujarat</div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-chrome-800 bg-obsidian-900 p-6 shadow-xl flex flex-col justify-between">
              <p className="text-xs text-chrome-300 leading-relaxed font-sans italic mb-6">
                "The Scikit-learn predictive model correctly identifies high evaporative stress hours and defers watering until dusk, avoiding thermal shock to delicate tomato roots."
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-obsidian-800">
                <img
                  src="https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=120&q=80"
                  alt="Dr. Sarah Chen"
                  className="h-10 w-10 rounded-xl object-cover border border-chrome-800"
                />
                <div>
                  <div className="text-xs font-bold text-white font-mono">Dr. Sarah Chen</div>
                  <div className="text-[10px] text-chrome-500 font-mono">Hydrology Researcher • AgriLab</div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-chrome-800 bg-obsidian-900 p-6 shadow-xl flex flex-col justify-between">
              <p className="text-xs text-chrome-300 leading-relaxed font-sans italic mb-6">
                "We integrated 14 ESP32 nodes across 4 zones in 2 hours. Having the simulated telemetry fallback allowed our software team to verify everything before wiring the pumps."
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-obsidian-800">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80"
                  alt="Marcus Vance"
                  className="h-10 w-10 rounded-xl object-cover border border-chrome-800"
                />
                <div>
                  <div className="text-xs font-bold text-white font-mono">Marcus Vance</div>
                  <div className="text-[10px] text-chrome-500 font-mono">IoT Automation Engineer</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="mt-auto border-t border-obsidian-800 bg-obsidian-950 py-8 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-chrome-500">
          <div className="flex items-center gap-2">
            <Flame className="h-4 w-4 text-crimson-laser" />
            <span className="font-bold text-white">KRISHIPULSE</span>
            <span>– Smart Agriculture & Water Management Matrix</span>
          </div>
          <p>© 2026 KrishiPulse. All rights reserved. Obsidian Black • Chrome Silver • Laser Crimson.</p>
        </div>
      </footer>
    </div>
  );
};
