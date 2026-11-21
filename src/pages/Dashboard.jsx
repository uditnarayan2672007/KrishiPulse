import React, { useState, useEffect } from 'react';
import {
  Droplets,
  Thermometer,
  CloudRain,
  Waves,
  Power,
  Cpu,
  BrainCircuit,
  Clock,
  Sparkles,
  ArrowUpRight,
  AlertTriangle,
  CheckCircle2,
  Zap,
  MapPin,
  Radio,
  BatteryCharging,
  Sun,
  Shield,
  Layers,
  Box,
} from 'lucide-react';
import { useDevice } from '../context/DeviceContext';
import { MetricCard } from '../components/MetricCard';
import { SimulatedBadge } from '../components/SimulatedBadge';
import { ThreeESP32Model } from '../components/ThreeESP32Model';
import { Link } from 'react-router-dom';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import { apiClient } from '../services/api';

export const Dashboard = () => {
  const {
    activeDevice,
    activeDeviceId,
    dashboardData,
    isLoading,
    isSimulatedMode,
    togglePump,
  } = useDevice();

  const [historyData, setHistoryData] = useState([]);
  const [isTogglingPump, setIsTogglingPump] = useState(false);
  const [actionMessage, setActionMessage] = useState(null);

  const dash = dashboardData?.dashboard || {};
  const rec = dashboardData?.recommendation || {};

  useEffect(() => {
    let mounted = true;
    apiClient.getSensorHistory(activeDeviceId, '24h').then((data) => {
      if (mounted) setHistoryData(data);
    });
    return () => {
      mounted = false;
    };
  }, [activeDeviceId]);

  const handlePumpClick = async () => {
    const nextCommand = dash.pumpStatus === 'ON' ? 'PUMP_OFF' : 'PUMP_ON';
    setIsTogglingPump(true);
    setActionMessage(null);
    try {
      const res = await togglePump(nextCommand, dash.operatingMode || 'MANUAL');
      setActionMessage({
        type: 'success',
        text: `Handshake confirmed: Command [${nextCommand}] executed on node ${activeDeviceId}.`,
      });
      setTimeout(() => setActionMessage(null), 4000);
    } catch (err) {
      setActionMessage({
        type: 'error',
        text: 'Failed to transmit pump command to hardware.',
      });
    } finally {
      setIsTogglingPump(false);
    }
  };

  const isPumpOn = dash.pumpStatus === 'ON';
  const isWaterAvailable = dash.waterAvailable !== false;

  return (
    <div className="space-y-6">
      {/* Top Banner with Field Drone Imagery & Active Node Status */}
      <div className="relative overflow-hidden rounded-3xl bg-obsidian-900 border border-chrome-800 shadow-2xl backdrop-blur-2xl">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1400&q=80"
            alt="Field Drone View"
            className="h-full w-full object-cover opacity-15 brightness-75 contrast-125"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-obsidian-950 via-obsidian-950/85 to-obsidian-950/50"></div>
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-crimson-laser/50 to-transparent"></div>
        </div>

        <div className="relative z-10 p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-crimson-laser animate-ping"></span>
              <span className="text-xs font-mono font-bold text-crimson-laser uppercase tracking-widest">
                ACTIVE CROP MATRIX // NODE {activeDeviceId}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white uppercase font-mono tracking-tight">
              {activeDevice?.deviceName || 'North Sector Wheat Field'}
            </h1>
            <p className="text-xs text-chrome-400 font-mono">
              PARCEL: <span className="text-white font-bold">{activeDevice?.zone || 'Zone 1A'}</span> • CROP:{' '}
              <span className="text-white font-bold">{activeDevice?.cropType || 'Wheat'}</span> • GOVERNANCE:{' '}
              <span className="text-crimson-laser font-black">{dash.operatingMode || 'AUTO'}</span> • STATUS:{' '}
              <span className="text-emerald-400 font-bold">ONLINE</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Actuator Trigger */}
            <button
              onClick={handlePumpClick}
              disabled={isTogglingPump || !isWaterAvailable}
              className={`flex items-center gap-2.5 rounded-2xl px-6 py-3.5 text-xs font-black uppercase tracking-wider transition-all font-mono shadow-laser-md hover:scale-105 ${
                isPumpOn
                  ? 'bg-gradient-to-r from-crimson-laser to-rose-700 text-white animate-pulse'
                  : 'bg-obsidian-950/90 border border-crimson-laser/60 text-white hover:bg-crimson-950 hover:text-crimson-laser'
              } disabled:opacity-40`}
            >
              <Power className={`h-4 w-4 ${isPumpOn ? 'text-white' : 'text-crimson-laser'}`} />
              <span>
                {isTogglingPump
                  ? 'COMMUNICATING...'
                  : isPumpOn
                  ? 'SHUT OFF PUMP RELAY'
                  : 'ENGAGE IRRIGATION PUMP'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Action Notification */}
      {actionMessage && (
        <div
          className={`flex items-center gap-3 rounded-2xl p-4 text-xs font-mono font-bold border backdrop-blur-md ${
            actionMessage.type === 'success'
              ? 'bg-obsidian-900 border-crimson-laser/50 text-crimson-400 shadow-laser-sm'
              : 'bg-obsidian-900 border-rose-500/50 text-rose-400'
          }`}
        >
          <CheckCircle2 className="h-4 w-4 shrink-0 text-crimson-laser" />
          <span>{actionMessage.text}</span>
        </div>
      )}

      {/* 4 Core Telemetry Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Soil Hydration"
          value={dash.soilMoisture !== undefined ? `${dash.soilMoisture}%` : '--'}
          icon={Droplets}
          color="crimson"
          subtitle={
            dash.soilMoisture < 35
              ? 'Critical moisture depletion'
              : dash.soilMoisture > 70
              ? 'Saturated soil profile'
              : 'Target root hydration'
          }
        />

        <MetricCard
          title="Ambient Temperature"
          value={dash.temperature !== undefined ? `${dash.temperature}°C` : '--'}
          icon={Thermometer}
          color="chrome"
          subtitle="DHT11 calibrated sensor"
        />

        <MetricCard
          title="Relative Humidity"
          value={dash.humidity !== undefined ? `${dash.humidity}%` : '--'}
          icon={CloudRain}
          color="chrome"
          subtitle="Vapor deficit: 1.4 kPa"
        />

        <MetricCard
          title="Reservoir Head"
          value={isWaterAvailable ? 'ADEQUATE' : 'EMPTY'}
          icon={Waves}
          color={isWaterAvailable ? 'chrome' : 'crimson'}
          subtitle={isWaterAvailable ? 'Float switch: Pass' : 'Relay interlock active'}
        />
      </div>

      {/* NEW: 3D Hardware Digital Twin & Live Actuator Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Interactive 3D ESP32 Hardware Model Viewport */}
        <div className="lg:col-span-8 rounded-3xl bg-gradient-to-b from-obsidian-850 to-obsidian-900 border border-chrome-800 p-6 shadow-2xl relative flex flex-col justify-between backdrop-blur-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Box className="h-4 w-4 text-crimson-laser" />
              <h2 className="text-xs font-black uppercase tracking-wider text-white font-mono">
                INTERACTIVE 3D DIGITAL TWIN // ESP32 + ADC PROBE
              </h2>
            </div>
            <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-crimson-950 text-crimson-laser border border-crimson-laser/40">
              WEBGL REAL-TIME ENGINE
            </span>
          </div>

          {/* 3D Canvas */}
          <div className="w-full h-80 rounded-2xl overflow-hidden border border-obsidian-750">
            <ThreeESP32Model isPumpActive={isPumpOn} moisture={dash.soilMoisture ?? 35} />
          </div>

          <div className="mt-4 pt-3 border-t border-obsidian-800 flex items-center justify-between text-xs font-mono text-chrome-400">
            <span>DRAG WITH MOUSE TO ROTATE 3D MODEL</span>
            <span className={isPumpOn ? 'text-crimson-laser font-bold' : 'text-chrome-300'}>
              PUMP RELAY: {isPumpOn ? 'CLOSED (WATER FLOWING IN 3D)' : 'OPEN (IDLE)'}
            </span>
          </div>
        </div>

        {/* Hardware Health & Power HUD */}
        <div className="lg:col-span-4 rounded-3xl bg-gradient-to-b from-obsidian-850 to-obsidian-900 border border-chrome-800 p-6 shadow-2xl flex flex-col justify-between backdrop-blur-xl">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-chrome-400 font-mono">
                ESP32 POWER & TELEMETRY
              </span>
              <span className="text-[10px] font-mono text-crimson-laser font-bold">
                NODE // {activeDeviceId}
              </span>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 rounded-2xl bg-obsidian-950 border border-obsidian-750 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <BatteryCharging className="h-4 w-4 text-emerald-400" />
                  <span className="text-chrome-300">Li-Ion Battery:</span>
                </div>
                <span className="font-bold text-white">96% (4.18V)</span>
              </div>

              <div className="p-3 rounded-2xl bg-obsidian-950 border border-obsidian-750 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Sun className="h-4 w-4 text-amber-400" />
                  <span className="text-chrome-300">Solar Array:</span>
                </div>
                <span className="font-bold text-white">+14.2W Active</span>
              </div>

              <div className="p-3 rounded-2xl bg-obsidian-950 border border-obsidian-750 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Radio className="h-4 w-4 text-crimson-laser" />
                  <span className="text-chrome-300">Wi-Fi Signal:</span>
                </div>
                <span className="font-bold text-crimson-laser">-62 dBm</span>
              </div>

              <div className="p-3 rounded-2xl bg-obsidian-950 border border-obsidian-750 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Cpu className="h-4 w-4 text-chrome-300" />
                  <span className="text-chrome-300">Firmware:</span>
                </div>
                <span className="font-bold text-chrome-400">v2.4.1-esp32</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-obsidian-800 text-[10px] font-mono text-chrome-500 flex items-center justify-between">
            <span>PACKET SUCCESS:</span>
            <span className="font-bold text-emerald-400">99.8% (0 LOSS)</span>
          </div>
        </div>
      </div>

      {/* Aerial Satellite Hotspot Map & Field Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Interactive Satellite Field Hotspot Card */}
        <div className="lg:col-span-8 rounded-3xl bg-obsidian-900 border border-chrome-800 p-6 shadow-2xl relative overflow-hidden backdrop-blur-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-crimson-laser" />
              <h2 className="text-xs font-black uppercase tracking-wider text-white font-mono">
                AERIAL SATELLITE NODE GEO-MATRIX
              </h2>
            </div>
            <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-obsidian-950 text-chrome-400 border border-chrome-800">
              COORDINATES: 22.2587° N, 71.1924° E
            </span>
          </div>

          <div className="relative h-64 sm:h-72 w-full rounded-2xl overflow-hidden border border-obsidian-750">
            <img
              src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80"
              alt="Satellite Farm Map"
              className="h-full w-full object-cover brightness-60 contrast-125"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950/80 via-transparent to-transparent"></div>

            {/* Hotspot Pin 1: Active Device */}
            <div className="absolute top-1/3 left-1/4 -translate-x-1/2 -translate-y-1/2 group cursor-pointer">
              <div className="relative flex items-center justify-center">
                <span className="animate-ping absolute h-8 w-8 rounded-full bg-crimson-laser opacity-75"></span>
                <div className="h-5 w-5 rounded-full bg-crimson-laser border-2 border-white flex items-center justify-center shadow-laser-md">
                  <span className="h-1.5 w-1.5 rounded-full bg-white"></span>
                </div>
              </div>
              <div className="mt-2 bg-obsidian-950/95 border border-crimson-laser p-2 rounded-xl text-[10px] font-mono text-white shadow-laser-sm backdrop-blur-md whitespace-nowrap">
                <div className="font-bold text-crimson-laser">NODE KP001 (ACTIVE)</div>
                <div>Moisture: {dash.soilMoisture}% • Wheat</div>
              </div>
            </div>

            {/* Hotspot Pin 2 */}
            <div className="absolute top-1/2 right-1/3 -translate-x-1/2 -translate-y-1/2 group cursor-pointer">
              <div className="relative flex items-center justify-center">
                <div className="h-4 w-4 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center">
                  <span className="h-1 w-1 rounded-full bg-white"></span>
                </div>
              </div>
              <div className="mt-2 bg-obsidian-950/90 border border-chrome-700 p-2 rounded-xl text-[10px] font-mono text-chrome-300 shadow-md backdrop-blur-md whitespace-nowrap">
                <div className="font-bold text-white">NODE KP002</div>
                <div>Moisture: 48.0% • Greenhouse Drip</div>
              </div>
            </div>

            {/* Hotspot Pin 3 */}
            <div className="absolute bottom-1/4 right-1/4 -translate-x-1/2 -translate-y-1/2 group cursor-pointer">
              <div className="relative flex items-center justify-center">
                <div className="h-4 w-4 rounded-full bg-zinc-600 border-2 border-zinc-400 flex items-center justify-center">
                  <span className="h-1 w-1 rounded-full bg-zinc-400"></span>
                </div>
              </div>
              <div className="mt-2 bg-obsidian-950/90 border border-chrome-800 p-2 rounded-xl text-[10px] font-mono text-chrome-500 shadow-md backdrop-blur-md whitespace-nowrap">
                <div className="font-bold text-zinc-400">NODE KP003 (OFFLINE)</div>
                <div>South Citrus Orchard</div>
              </div>
            </div>
          </div>
        </div>

        {/* Live Operator Activity Feed with Avatars */}
        <div className="lg:col-span-4 rounded-3xl bg-gradient-to-b from-obsidian-850 to-obsidian-900 border border-chrome-800 p-6 shadow-2xl backdrop-blur-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-chrome-400 font-mono">
                OPERATOR COMMAND FEED
              </span>
              <span className="text-[10px] font-mono text-emerald-400 font-bold">LIVE STREAM</span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-obsidian-950 border border-obsidian-750">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                  alt="Ramesh Patel"
                  className="h-9 w-9 rounded-xl object-cover border border-crimson-laser/40"
                />
                <div className="truncate flex-1">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="font-bold text-white">Ramesh Patel</span>
                    <span className="text-[10px] text-chrome-500">2m ago</span>
                  </div>
                  <p className="text-[11px] text-chrome-400 truncate font-mono">
                    Triggered pump cycle on <span className="text-crimson-laser">KP001</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-2xl bg-obsidian-950 border border-obsidian-750">
                <img
                  src="https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=120&q=80"
                  alt="Dr. Sarah Chen"
                  className="h-9 w-9 rounded-xl object-cover border border-chrome-700"
                />
                <div className="truncate flex-1">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="font-bold text-white">Dr. Sarah Chen</span>
                    <span className="text-[10px] text-chrome-500">18m ago</span>
                  </div>
                  <p className="text-[11px] text-chrome-400 truncate font-mono">
                    Synchronized ML model weights <span className="text-emerald-400">v1.1</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-2xl bg-obsidian-950 border border-obsidian-750">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80"
                  alt="Marcus Vance"
                  className="h-9 w-9 rounded-xl object-cover border border-chrome-700"
                />
                <div className="truncate flex-1">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="font-bold text-white">Marcus Vance</span>
                    <span className="text-[10px] text-chrome-500">45m ago</span>
                  </div>
                  <p className="text-[11px] text-chrome-400 truncate font-mono">
                    Calibrated capacitive probe on <span className="text-white">KP002</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-obsidian-800 text-[10px] font-mono text-chrome-500 flex justify-between">
            <span>AUDIT TRAIL:</span>
            <span className="text-white font-bold">ENCRYPTED LOG</span>
          </div>
        </div>
      </div>

      {/* 24-Hour Telemetry Chart in Laser Crimson & Chrome */}
      <div className="rounded-3xl bg-gradient-to-b from-obsidian-850 to-obsidian-900 border border-chrome-800 p-6 shadow-2xl backdrop-blur-xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6">
          <div>
            <h2 className="text-sm font-black uppercase tracking-wider text-white font-mono">
              24-Hour Telemetry Matrix
            </h2>
            <p className="text-xs text-chrome-400">
              Soil moisture percentage (Laser Crimson) vs Ambient temperature (Chrome Silver)
            </p>
          </div>
          <Link
            to="/analytics"
            className="text-xs text-crimson-laser hover:text-white font-mono font-bold flex items-center gap-1 transition"
          >
            <span>FULL HISTORICAL TELEMETRY</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={historyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="moistureCrimsonGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ff003b" stopOpacity={0.45} />
                  <stop offset="95%" stopColor="#ff003b" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="tempChromeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#cbd5e1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#cbd5e1" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1b1f2c" />
              <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 10, fontFamily: 'monospace' }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 10, fontFamily: 'monospace' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0a0c10',
                  borderColor: '#333a4f',
                  borderRadius: '0.75rem',
                  fontSize: '11px',
                  fontFamily: 'monospace',
                  color: '#f8fafc',
                  boxShadow: '0 0 20px rgba(0,0,0,0.8)',
                }}
              />
              <Area
                type="monotone"
                dataKey="soilMoisture"
                stroke="#ff003b"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#moistureCrimsonGrad)"
                name="Soil Moisture (%)"
              />
              <Area
                type="monotone"
                dataKey="temperature"
                stroke="#cbd5e1"
                strokeWidth={1.8}
                fillOpacity={1}
                fill="url(#tempChromeGrad)"
                name="Temperature (°C)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
