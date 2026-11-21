import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Activity,
  Droplets,
  Cpu,
  BarChart3,
  BrainCircuit,
  Settings,
  Flame,
  LogOut,
  Radio,
  Users,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Live Sensors', href: '/sensors', icon: Activity },
  { name: 'Irrigation Control', href: '/irrigation', icon: Droplets },
  { name: 'Devices & Fleet', href: '/devices', icon: Cpu },
  { name: 'Analytics & Trends', href: '/analytics', icon: BarChart3 },
  { name: 'AI Recommendations', href: '/ml', icon: BrainCircuit },
  { name: 'System Settings', href: '/settings', icon: Settings },
];

export const Sidebar = ({ mobileOpen, setMobileOpen }) => {
  const { logout, user } = useAuth();

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-obsidian-950/90 backdrop-blur-md lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex w-64 flex-col bg-obsidian-950/95 border-r border-chrome-800/60 shadow-2xl backdrop-blur-2xl transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Banner */}
        <div className="flex h-20 items-center gap-3.5 px-6 border-b border-obsidian-800 bg-gradient-to-b from-obsidian-900 to-obsidian-950">
          <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-crimson-laser via-rose-600 to-amber-500 p-0.5 shadow-laser-md">
            <div className="flex h-full w-full items-center justify-center rounded-[14px] bg-obsidian-950">
              <Flame className="h-5 w-5 text-crimson-laser animate-pulse" />
            </div>
            <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-obsidian-950 border border-chrome-800">
              <span className="h-2 w-2 rounded-full bg-crimson-laser animate-ping"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-lg tracking-tight text-white font-mono">KRISHI</span>
              <span className="font-black text-lg tracking-tight text-laser-crimson font-mono">PULSE</span>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
              <p className="text-[10px] font-bold uppercase tracking-widest text-chrome-400 font-mono">
                AUTONOMOUS V2.4
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-1.5 px-3 py-6 overflow-y-auto">
          <div className="px-3 mb-2 text-[10px] font-black uppercase tracking-widest text-chrome-500 font-mono">
            COMMAND CENTER
          </div>
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `group relative flex items-center gap-3.5 rounded-xl px-3.5 py-2.5 text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-crimson-950/80 to-obsidian-900 text-white border border-crimson-laser/60 shadow-laser-sm'
                    : 'text-chrome-400 hover:bg-obsidian-850 hover:text-white border border-transparent'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-crimson-laser shadow-laser-sm"></span>
                  )}
                  <item.icon
                    className={`h-4 w-4 shrink-0 transition-all ${
                      isActive ? 'text-crimson-laser scale-110' : 'group-hover:text-crimson-laser'
                    }`}
                  />
                  <span>{item.name}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Station Telemetry Status Widget */}
        <div className="px-4 py-3 mx-3 mb-3 rounded-2xl bg-gradient-to-b from-obsidian-900 to-obsidian-950 border border-chrome-800/80 shadow-inner">
          <div className="flex items-center justify-between text-[10px] font-mono font-bold text-chrome-400 mb-2">
            <span className="flex items-center gap-1.5">
              <Radio className="h-3 w-3 text-crimson-laser" />
              RF GATEWAY
            </span>
            <span className="text-emerald-400 font-mono">99.8% RSSI</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-obsidian-800 overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-crimson-laser via-amber-400 to-emerald-400 w-4/5 animate-pulse"></div>
          </div>
        </div>

        {/* Operator Profile Avatar Box */}
        <div className="border-t border-obsidian-800 p-4 bg-obsidian-900/90">
          <div className="flex items-center gap-3 mb-3">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                alt="Lead Agronomist"
                className="h-10 w-10 rounded-xl object-cover border border-crimson-laser/40 shadow-laser-sm"
              />
              <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500 border-2 border-obsidian-950"></span>
            </div>
            <div className="truncate flex-1">
              <p className="text-xs font-black text-white truncate font-mono uppercase tracking-wide">
                {user?.user_metadata?.fullName || 'Ramesh Patel'}
              </p>
              <p className="text-[10px] text-crimson-laser font-bold truncate font-mono">
                LEAD AGRONOMIST
              </p>
            </div>
          </div>

          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 rounded-xl border border-chrome-800 bg-obsidian-950 py-2 text-[11px] font-bold text-chrome-400 hover:border-crimson-laser/60 hover:text-crimson-laser transition font-mono"
          >
            <LogOut className="h-3 w-3" />
            <span>TERMINATE CONSOLE</span>
          </button>
        </div>
      </aside>
    </>
  );
};
