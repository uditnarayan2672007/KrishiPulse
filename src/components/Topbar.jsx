import React from 'react';
import { Menu, RefreshCw, Cpu, Wifi, Bell, Shield, Radio, Sparkles } from 'lucide-react';
import { useDevice } from '../context/DeviceContext';
import { SimulatedBadge } from './SimulatedBadge';

export const Topbar = ({ setMobileOpen }) => {
  const {
    devices,
    activeDeviceId,
    setActiveDeviceId,
    activeDevice,
    dashboardData,
    refreshDashboard,
    isSimulatedMode,
    lastRefreshed,
  } = useDevice();

  const isOnline =
    dashboardData?.dashboard?.connectionStatus === 'ONLINE' ||
    activeDevice?.connectionStatus === 'ONLINE';

  return (
    <header className="sticky top-0 z-30 flex h-20 w-full items-center justify-between border-b border-obsidian-800 bg-obsidian-950/85 backdrop-blur-2xl px-4 sm:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="rounded-xl p-2.5 text-chrome-400 hover:bg-obsidian-850 hover:text-white lg:hidden border border-chrome-800"
          onClick={() => setMobileOpen(true)}
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Device Switcher with Node Icon */}
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-obsidian-900 border border-chrome-800 text-crimson-laser shadow-sm hidden sm:flex">
            <Cpu className="h-4 w-4" />
          </div>
          <select
            value={activeDeviceId}
            onChange={(e) => setActiveDeviceId(e.target.value)}
            className="rounded-xl border border-chrome-800 bg-obsidian-900/90 py-2 pl-3 pr-8 text-xs font-mono font-bold text-white focus:border-crimson-laser focus:outline-none focus:ring-1 focus:ring-crimson-laser shadow-inner"
          >
            {devices.map((device) => (
              <option key={device.deviceId} value={device.deviceId} className="bg-obsidian-900 text-white">
                NODE // {device.deviceId} – {device.deviceName}
              </option>
            ))}
          </select>
        </div>

        {/* Live ESP32 connection indicator with ping */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-mono bg-obsidian-900/90 border border-chrome-800">
          <span className="relative flex h-2 w-2">
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full ${
                isOnline ? 'bg-crimson-laser' : 'bg-zinc-600'
              } opacity-75`}
            ></span>
            <span
              className={`relative inline-flex rounded-full h-2 w-2 ${
                isOnline ? 'bg-crimson-laser' : 'bg-zinc-600'
              }`}
            ></span>
          </span>
          <span className={isOnline ? 'text-crimson-laser font-black' : 'text-chrome-500'}>
            ESP32: {isOnline ? 'STREAMING' : 'STANDBY'}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Active Field Operators Avatar Stack */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-obsidian-900/80 border border-chrome-800">
          <span className="text-[10px] font-mono font-bold text-chrome-400 uppercase tracking-widest mr-1">
            CREW:
          </span>
          <div className="flex -space-x-2">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
              alt="Operator"
              title="Ramesh Patel (Chief Agronomist)"
              className="h-7 w-7 rounded-full object-cover border-2 border-obsidian-950 ring-1 ring-crimson-laser"
            />
            <img
              src="https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=120&q=80"
              alt="Operator"
              title="Dr. Sarah Chen (Soil Hydrologist)"
              className="h-7 w-7 rounded-full object-cover border-2 border-obsidian-950 ring-1 ring-chrome-600"
            />
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80"
              alt="Operator"
              title="Marcus Vance (IoT Hardware Lead)"
              className="h-7 w-7 rounded-full object-cover border-2 border-obsidian-950 ring-1 ring-chrome-600"
            />
          </div>
          <span className="h-2 w-2 rounded-full bg-emerald-400 ml-1"></span>
        </div>

        {/* Simulated Badge */}
        {isSimulatedMode && <SimulatedBadge className="hidden md:inline-flex" />}

        {/* Manual Refresh button */}
        <button
          onClick={() => refreshDashboard()}
          title="Manual Polling Refresh"
          className="flex items-center gap-1.5 rounded-xl border border-chrome-800 bg-obsidian-900/90 px-3.5 py-2 text-xs font-mono font-bold text-chrome-200 hover:border-crimson-laser hover:text-crimson-laser transition shadow-sm"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">SYNC</span>
        </button>
      </div>
    </header>
  );
};
