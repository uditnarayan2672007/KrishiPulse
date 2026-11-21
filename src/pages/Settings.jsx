import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  User,
  Shield,
  Database,
  Bell,
  Cpu,
  Save,
  CheckCircle2,
  Users,
  Key,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { isSupabaseConfigured } from '../services/supabase';

const OPERATOR_TEAM = [
  {
    id: 1,
    name: 'Ramesh Patel',
    role: 'Lead Agronomist',
    email: 'farmer@krishipulse.org',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
    permission: 'Full Admin',
  },
  {
    id: 2,
    name: 'Dr. Sarah Chen',
    role: 'Soil Hydrologist',
    email: 'sarah.chen@agrilab.org',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=120&q=80',
    permission: 'ML & Analytics',
  },
  {
    id: 3,
    name: 'Marcus Vance',
    role: 'IoT Hardware Lead',
    email: 'm.vance@embeddediot.io',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
    permission: 'Hardware & Calibration',
  },
];

export const Settings = () => {
  const { user, isDemoUser } = useAuth();
  const [savedNotice, setSavedNotice] = useState(false);

  const [notificationSettings, setNotificationSettings] = useState({
    emailAlerts: true,
    lowWaterAlerts: true,
    criticalSoilAlerts: true,
  });

  const handleSave = (e) => {
    e.preventDefault();
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black uppercase tracking-wider text-white font-mono">
          SYSTEM MATRIX & OPERATOR CONFIGURATION
        </h1>
        <p className="text-xs text-chrome-400 mt-1 font-mono">
          Operator profile, cloud database cluster health, and hardware alert thresholds
        </p>
      </div>

      {savedNotice && (
        <div className="flex items-center gap-2 rounded-2xl bg-obsidian-900 border border-crimson-laser/50 p-3.5 text-xs text-crimson-400 font-mono font-bold shadow-laser-sm">
          <CheckCircle2 className="h-4 w-4 text-crimson-laser" />
          <span>CONFIGURATION COMMITTED TO LOCAL MATRIX.</span>
        </div>
      )}

      {/* Operator Profile in Obsidian & Chrome with Avatar */}
      <div className="rounded-3xl bg-gradient-to-b from-obsidian-850 to-obsidian-900 border border-chrome-800 p-6 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center gap-2 mb-5">
          <User className="h-5 w-5 text-crimson-laser" />
          <h2 className="text-xs font-black uppercase tracking-wider text-white font-mono">
            Active Operator Profile
          </h2>
        </div>

        <div className="flex items-center gap-4 mb-6 p-4 rounded-2xl bg-obsidian-950 border border-obsidian-750">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
            alt="Current Operator"
            className="h-16 w-16 rounded-2xl object-cover border-2 border-crimson-laser shadow-laser-sm"
          />
          <div>
            <h3 className="text-sm font-black text-white font-mono uppercase">
              {user?.user_metadata?.fullName || 'Ramesh Patel'}
            </h3>
            <span className="text-[10px] font-mono font-bold text-crimson-laser uppercase tracking-widest">
              ROLE: CHIEF ARABLE AGRONOMIST
            </span>
            <p className="text-[11px] text-chrome-500 font-mono mt-0.5">
              ID: {user?.id || 'kp-operator-001'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4 font-mono">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-chrome-400">
                Operator Full Name
              </label>
              <input
                type="text"
                defaultValue={user?.user_metadata?.fullName || 'Ramesh Patel'}
                className="mt-1.5 w-full rounded-xl border border-chrome-800 bg-obsidian-950 py-2.5 px-3.5 text-xs text-white focus:border-crimson-laser focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-chrome-400">
                Authenticated Email
              </label>
              <input
                type="email"
                disabled
                defaultValue={user?.email || 'farmer@krishipulse.org'}
                className="mt-1.5 w-full rounded-xl border border-obsidian-800 bg-obsidian-950/60 py-2.5 px-3.5 text-xs text-chrome-500 cursor-not-allowed"
              />
            </div>
          </div>

          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-crimson-laser to-rose-700 px-5 py-2.5 text-xs font-black uppercase tracking-wider text-white hover:scale-105 transition shadow-laser-sm"
          >
            <Save className="h-3.5 w-3.5" />
            <span>SAVE OPERATOR CONFIG</span>
          </button>
        </form>
      </div>

      {/* Operator Team Directory with Avatars */}
      <div className="rounded-3xl bg-gradient-to-b from-obsidian-850 to-obsidian-900 border border-chrome-800 p-6 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center gap-2 mb-4">
          <Users className="h-5 w-5 text-chrome-300" />
          <h2 className="text-xs font-black uppercase tracking-wider text-white font-mono">
            Authorized Field Operators & Personnel
          </h2>
        </div>

        <div className="space-y-3 font-mono">
          {OPERATOR_TEAM.map((op) => (
            <div
              key={op.id}
              className="flex items-center justify-between p-3.5 rounded-2xl bg-obsidian-950 border border-obsidian-750"
            >
              <div className="flex items-center gap-3">
                <img
                  src={op.avatar}
                  alt={op.name}
                  className="h-10 w-10 rounded-xl object-cover border border-chrome-700"
                />
                <div>
                  <div className="text-xs font-bold text-white">{op.name}</div>
                  <div className="text-[10px] text-chrome-500">{op.role}</div>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-obsidian-900 text-chrome-300 border border-chrome-800">
                {op.permission}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Cloud & Architecture Integration Status */}
      <div className="rounded-3xl bg-gradient-to-b from-obsidian-850 to-obsidian-900 border border-chrome-800 p-6 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center gap-2 mb-4">
          <Database className="h-5 w-5 text-chrome-300" />
          <h2 className="text-xs font-black uppercase tracking-wider text-white font-mono">
            Cloud Infrastructure Matrix
          </h2>
        </div>

        <div className="space-y-3 text-xs font-mono">
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-obsidian-950 border border-obsidian-750">
            <div>
              <span className="font-bold text-white uppercase">Supabase Cryptographic Auth:</span>
              <p className="text-chrome-500 text-[10px] mt-0.5">
                Authentication & JWT session token verification
              </p>
            </div>
            <span
              className={`px-3 py-1 rounded-full font-bold text-[10px] ${
                isSupabaseConfigured
                  ? 'bg-crimson-950/60 text-crimson-laser border border-crimson-laser/40 shadow-laser-sm'
                  : 'bg-obsidian-900 text-chrome-300 border border-chrome-700'
              }`}
            >
              {isSupabaseConfigured ? 'CONNECTED' : 'SIMULATED DEMO MATRIX'}
            </span>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-obsidian-950 border border-obsidian-750">
            <div>
              <span className="font-bold text-white uppercase">MongoDB Atlas Cluster:</span>
              <p className="text-chrome-500 text-[10px] mt-0.5">
                Primary document store (6 collections configured)
              </p>
            </div>
            <span className="px-3 py-1 rounded-full font-bold text-[10px] bg-obsidian-900 text-chrome-300 border border-chrome-700">
              MODELS INITIALIZED
            </span>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-obsidian-950 border border-obsidian-750">
            <div>
              <span className="font-bold text-white uppercase">ESP32 Hardware Node Connector:</span>
              <p className="text-chrome-500 text-[10px] mt-0.5">
                Command lease endpoint on /api/command with HTTPS
              </p>
            </div>
            <span className="px-3 py-1 rounded-full font-bold text-[10px] bg-crimson-950/60 text-crimson-laser border border-crimson-laser/40 shadow-laser-sm">
              LISTENING (POLLING READY)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
