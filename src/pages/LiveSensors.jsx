import React, { useState } from 'react';
import {
  Droplets,
  Thermometer,
  CloudRain,
  Waves,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Info,
  RefreshCw,
  Flame,
  Layers,
  Box,
} from 'lucide-react';
import { useDevice } from '../context/DeviceContext';
import { MetricCard } from '../components/MetricCard';
import { ThreeSoilStrataModel } from '../components/ThreeSoilStrataModel';

export const LiveSensors = () => {
  const { activeDevice, activeDeviceId, dashboardData, refreshDashboard } = useDevice();
  const dash = dashboardData?.dashboard || {};

  const [threshold, setThreshold] = useState(35);
  const [saveMsg, setSaveMsg] = useState(false);

  const moisture = dash.soilMoisture ?? 35;
  const temp = dash.temperature ?? 28;
  const humidity = dash.humidity ?? 60;
  const waterAvailable = dash.waterAvailable !== false;

  const handleSaveThreshold = (e) => {
    e.preventDefault();
    setSaveMsg(true);
    setTimeout(() => setSaveMsg(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black uppercase tracking-wider text-white font-mono">
            LIVE SENSOR CALIBRATION MATRIX
          </h1>
          <p className="text-xs text-chrome-400 mt-1 font-mono">
            ADC capacitive soil moisture, DHT11 digital bus telemetry, and 3D root penetration strata
          </p>
        </div>
        <button
          onClick={() => refreshDashboard()}
          className="inline-flex items-center gap-2 rounded-2xl border border-chrome-800 bg-obsidian-900 px-4 py-2.5 text-xs font-mono font-bold text-chrome-200 hover:border-crimson-laser/50 hover:text-crimson-laser transition shadow-sm"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>POLL HARDWARE</span>
        </button>
      </div>

      {/* Main Visual Gauges in Laser Crimson & Chrome */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Soil Moisture Gauge */}
        <div className="rounded-3xl bg-gradient-to-b from-obsidian-850 to-obsidian-900 border border-crimson-laser/40 p-6 shadow-laser-sm flex flex-col justify-between backdrop-blur-xl">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-widest text-chrome-400 font-mono">
                SOIL HYDRATION
              </span>
              <Droplets className="h-5 w-5 text-crimson-laser" />
            </div>

            <div className="mt-6 flex flex-col items-center">
              <div className="relative flex items-center justify-center">
                <svg className="h-32 w-32 -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="54"
                    stroke="#1b1f2c"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="54"
                    stroke="#ff003b"
                    strokeWidth="8"
                    strokeDasharray={339}
                    strokeDashoffset={339 - (339 * Math.min(100, Math.max(0, moisture))) / 100}
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-1000 ease-out drop-shadow-[0_0_8px_rgba(255,0,59,0.7)]"
                  />
                </svg>
                <div className="absolute text-center">
                  <span className="text-3xl font-black text-white font-mono">{moisture}%</span>
                  <div className="text-[9px] text-crimson-laser uppercase font-bold tracking-widest font-mono">MOISTURE</div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-obsidian-750 text-xs font-mono flex justify-between items-center">
            <span className="text-chrome-500">AUTO TRIGGER:</span>
            <span className="font-bold text-crimson-laser">&lt; {threshold}%</span>
          </div>
        </div>

        {/* Temperature Card */}
        <div className="rounded-3xl bg-gradient-to-b from-obsidian-850 to-obsidian-900 border border-chrome-800 p-6 shadow-chrome-card flex flex-col justify-between backdrop-blur-xl">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-widest text-chrome-400 font-mono">
                AMBIENT TEMPERATURE
              </span>
              <Thermometer className="h-5 w-5 text-chrome-300" />
            </div>

            <div className="mt-6 flex flex-col items-center">
              <div className="relative flex items-center justify-center">
                <svg className="h-32 w-32 -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="54"
                    stroke="#1b1f2c"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="54"
                    stroke="#cbd5e1"
                    strokeWidth="8"
                    strokeDasharray={339}
                    strokeDashoffset={339 - (339 * Math.min(50, Math.max(0, temp))) / 50}
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute text-center">
                  <span className="text-3xl font-black text-white font-mono">{temp}°C</span>
                  <div className="text-[9px] text-chrome-400 uppercase font-bold tracking-widest font-mono">CELSIUS</div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-obsidian-750 text-xs font-mono flex justify-between items-center">
            <span className="text-chrome-500">SENSOR BUS:</span>
            <span className="text-white font-bold">DHT11 (PIN 4)</span>
          </div>
        </div>

        {/* Humidity Card */}
        <div className="rounded-3xl bg-gradient-to-b from-obsidian-850 to-obsidian-900 border border-chrome-800 p-6 shadow-chrome-card flex flex-col justify-between backdrop-blur-xl">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-widest text-chrome-400 font-mono">
                ATMOSPHERIC RH
              </span>
              <CloudRain className="h-5 w-5 text-chrome-300" />
            </div>

            <div className="mt-6 flex flex-col items-center">
              <div className="relative flex items-center justify-center">
                <svg className="h-32 w-32 -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="54"
                    stroke="#1b1f2c"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="54"
                    stroke="#94a3b8"
                    strokeWidth="8"
                    strokeDasharray={339}
                    strokeDashoffset={339 - (339 * Math.min(100, Math.max(0, humidity))) / 100}
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute text-center">
                  <span className="text-3xl font-black text-white font-mono">{humidity}%</span>
                  <div className="text-[9px] text-chrome-400 uppercase font-bold tracking-widest font-mono">VAPOR</div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-obsidian-750 text-xs font-mono flex justify-between items-center">
            <span className="text-chrome-500">PRESSURE:</span>
            <span className="text-white font-bold">NOMINAL</span>
          </div>
        </div>

        {/* Water Reservoir Status */}
        <div className="rounded-3xl bg-gradient-to-b from-obsidian-850 to-obsidian-900 border border-chrome-800 p-6 shadow-chrome-card flex flex-col justify-between backdrop-blur-xl">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-widest text-chrome-400 font-mono">
                HEAD PRESSURE
              </span>
              <Waves className="h-5 w-5 text-chrome-300" />
            </div>

            <div className="mt-6 flex flex-col items-center justify-center py-3">
              <div
                className={`h-20 w-20 rounded-2xl flex items-center justify-center border-2 ${
                  waterAvailable
                    ? 'border-chrome-700 bg-obsidian-950 text-chrome-300'
                    : 'border-crimson-laser bg-crimson-950/40 text-crimson-laser animate-pulse shadow-laser-md'
                }`}
              >
                <Waves className="h-10 w-10" />
              </div>
              <div className="mt-3 text-center">
                <span className="text-sm font-black text-white font-mono uppercase">
                  {waterAvailable ? 'TANK SUFFICIENT' : 'RESERVOIR EMPTY'}
                </span>
                <p className="text-[10px] text-chrome-500 mt-0.5 font-mono">
                  {waterAvailable ? 'Interlock safety: Clear' : 'Actuator circuit locked'}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-obsidian-750 text-xs font-mono flex justify-between items-center">
            <span className="text-chrome-500">FLOAT INTERLOCK:</span>
            <span className={waterAvailable ? 'text-chrome-200 font-bold' : 'text-crimson-laser font-black'}>
              {waterAvailable ? 'PASSED' : 'TRIPPED'}
            </span>
          </div>
        </div>
      </div>

      {/* NEW: Interactive 3D Soil Strata Depth Model Viewport */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 rounded-3xl bg-gradient-to-b from-obsidian-850 to-obsidian-900 border border-chrome-800 p-6 shadow-2xl relative flex flex-col justify-between backdrop-blur-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-crimson-laser" />
              <h2 className="text-xs font-black uppercase tracking-wider text-white font-mono">
                3D VOLUMETRIC SOIL STRATA // ROOT WATER INFILTRATION
              </h2>
            </div>
            <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-crimson-950 text-crimson-laser border border-crimson-laser/40">
              3D ISOMETRIC VIEWPORT
            </span>
          </div>

          {/* 3D Canvas */}
          <div className="w-full h-80 rounded-2xl overflow-hidden border border-obsidian-750">
            <ThreeSoilStrataModel moisture={moisture} />
          </div>

          <div className="mt-4 pt-3 border-t border-obsidian-800 flex items-center justify-between text-xs font-mono text-chrome-400">
            <span>DRAG TO ROTATE 3D SOIL BLOCK</span>
            <span className="text-crimson-laser font-bold">
              ROOT HYDRATION: {moisture}% VOLUMETRIC
            </span>
          </div>
        </div>

        {/* Calibration Settings Form */}
        <div className="lg:col-span-5 rounded-3xl bg-gradient-to-b from-obsidian-850 to-obsidian-900 border border-chrome-800 p-6 shadow-2xl flex flex-col justify-between backdrop-blur-xl">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Sliders className="h-5 w-5 text-crimson-laser" />
              <h2 className="text-xs font-black uppercase tracking-wider text-white font-mono">
                Soil Moisture Trigger Calibration
              </h2>
            </div>

            <form onSubmit={handleSaveThreshold} className="space-y-4 font-mono">
              <p className="text-xs text-chrome-400 leading-relaxed font-sans">
                When operating in <strong>AUTO</strong> mode, the closed-loop IoT controller triggers pump actuation whenever capacitive soil moisture drops below this calibrated threshold.
              </p>

              <div>
                <div className="flex justify-between text-xs font-bold text-chrome-300 mb-2">
                  <span>CUTOFF MOISTURE THRESHOLD:</span>
                  <span className="text-crimson-laser font-black text-sm">{threshold}%</span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="65"
                  step="1"
                  value={threshold}
                  onChange={(e) => setThreshold(Number(e.target.value))}
                  className="w-full accent-crimson-laser cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-chrome-500 mt-1">
                  <span>15% (Arid)</span>
                  <span>35% (Recommended for Cereals)</span>
                  <span>65% (Moist)</span>
                </div>
              </div>

              {saveMsg && (
                <div className="flex items-center gap-2 text-xs text-crimson-laser font-bold">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Threshold calibrated and synchronized to {activeDeviceId}.</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full rounded-2xl bg-gradient-to-r from-crimson-laser to-rose-700 px-5 py-3 text-xs font-black uppercase tracking-wider text-white shadow-laser-sm hover:scale-105 transition"
              >
                SAVE CALIBRATION THRESHOLD
              </button>
            </form>
          </div>

          <div className="mt-6 pt-4 border-t border-obsidian-800 text-[10px] font-mono text-chrome-500 flex justify-between">
            <span>ACTIVE PROBE:</span>
            <span className="text-white font-bold">ADC1_CH6 (GPIO 34)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
