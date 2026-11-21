import React, { useState } from 'react';
import {
  Cpu,
  Plus,
  Trash2,
  Key,
  Wifi,
  Copy,
  Check,
  ShieldCheck,
  AlertCircle,
  Radio,
  MapPin,
  ExternalLink,
} from 'lucide-react';
import { useDevice } from '../context/DeviceContext';
import { apiClient } from '../services/api';

const DEVICE_IMAGES = {
  KP001: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80',
  KP002: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=600&q=80',
  KP003: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=600&q=80',
};

const OPERATOR_AVATARS = {
  KP001: {
    name: 'Ramesh Patel',
    role: 'Lead Agronomist',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
  },
  KP002: {
    name: 'Dr. Sarah Chen',
    role: 'Soil Hydrologist',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=120&q=80',
  },
  KP003: {
    name: 'Marcus Vance',
    role: 'IoT Hardware Lead',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
  },
};

export const DeviceManagement = () => {
  const { devices, refreshDevices, activeDeviceId, setActiveDeviceId } = useDevice();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    deviceId: '',
    deviceName: '',
    cropType: 'Wheat',
    zone: 'Zone 1',
  });
  const [newDeviceToken, setNewDeviceToken] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    const res = await apiClient.registerDevice(formData);
    if (res?.deviceToken) {
      setNewDeviceToken({
        deviceId: res.device.deviceId,
        token: res.deviceToken,
      });
    }
    await refreshDevices();
    setShowModal(false);
  };

  const copyToken = () => {
    if (!newDeviceToken) return;
    navigator.clipboard.writeText(newDeviceToken.token);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black uppercase tracking-wider text-white font-mono">
            ESP32 HARDWARE FLEET DIRECTORY
          </h1>
          <p className="text-xs text-chrome-400 mt-1 font-mono">
            Microcontroller registry with field photography, assigned specialists, and cryptographic tokens
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-crimson-laser to-rose-700 px-5 py-3 text-xs font-mono font-black uppercase tracking-wider text-white shadow-laser-sm hover:scale-105 transition"
        >
          <Plus className="h-4 w-4" />
          <span>PROVISION NODE</span>
        </button>
      </div>

      {/* Provisioning Notification Banner in Obsidian Chrome */}
      {newDeviceToken && (
        <div className="rounded-3xl bg-gradient-to-r from-obsidian-900 to-obsidian-850 border border-crimson-laser/50 p-6 shadow-laser-md backdrop-blur-xl">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2 font-mono">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-crimson-laser" />
                <h3 className="text-sm font-black text-white uppercase">
                  NODE PROVISIONED // {newDeviceToken.deviceId}
                </h3>
              </div>
              <p className="text-xs text-chrome-400 font-sans">
                Flash this cryptographic pre-shared secret into your ESP32 C++ firmware. For security, this token is non-recoverable.
              </p>
              <div className="flex items-center gap-2 mt-2">
                <code className="rounded-xl bg-obsidian-950 px-3.5 py-2 font-mono text-xs text-crimson-laser border border-obsidian-750">
                  {newDeviceToken.token}
                </code>
                <button
                  onClick={copyToken}
                  className="flex items-center gap-1.5 rounded-xl bg-obsidian-800 border border-chrome-700 px-3.5 py-2 text-xs font-bold text-chrome-200 hover:border-crimson-laser transition"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-crimson-laser" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copied ? 'COPIED' : 'COPY TOKEN'}</span>
                </button>
              </div>
            </div>
            <button
              onClick={() => setNewDeviceToken(null)}
              className="text-xs text-chrome-500 hover:text-white font-mono"
            >
              [DISMISS]
            </button>
          </div>
        </div>
      )}

      {/* Device Cards Grid with Real Imagery & Operator Avatars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {devices.map((device) => {
          const isSelected = device.deviceId === activeDeviceId;
          const isOnline = device.connectionStatus === 'ONLINE';
          const imgUrl =
            DEVICE_IMAGES[device.deviceId] ||
            'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80';
          const operator = OPERATOR_AVATARS[device.deviceId] || {
            name: 'Priya Sharma',
            role: 'Field Specialist',
            avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80',
          };

          return (
            <div
              key={device.deviceId}
              onClick={() => setActiveDeviceId(device.deviceId)}
              className={`cursor-pointer rounded-3xl overflow-hidden transition-all border backdrop-blur-xl ${
                isSelected
                  ? 'bg-obsidian-900 border-crimson-laser shadow-laser-md ring-1 ring-crimson-laser/50'
                  : 'bg-obsidian-900 border-chrome-800 hover:border-chrome-600'
              }`}
            >
              {/* Field Location Photo Header */}
              <div className="h-36 w-full relative overflow-hidden">
                <img
                  src={imgUrl}
                  alt={device.deviceName}
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950 via-obsidian-950/40 to-transparent"></div>

                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-obsidian-950/80 text-white border border-chrome-800 backdrop-blur-md">
                  {device.deviceId}
                </div>

                <div className="absolute top-3 right-3">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono font-black ${
                      isOnline
                        ? 'bg-obsidian-950/90 text-crimson-laser border border-crimson-laser shadow-laser-sm'
                        : 'bg-obsidian-950/90 text-chrome-600 border border-obsidian-800'
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        isOnline ? 'bg-crimson-laser animate-ping' : 'bg-zinc-600'
                      }`}
                    />
                    {device.connectionStatus}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-sm font-black uppercase text-white font-mono truncate">
                    {device.deviceName}
                  </h3>
                  <p className="text-[11px] text-chrome-400 font-mono mt-0.5">
                    PARCEL: {device.zone || 'Sector 1'} • CROP: {device.cropType || 'Wheat'}
                  </p>
                </div>

                {/* Assigned Field Specialist Avatar */}
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-obsidian-950 border border-obsidian-750">
                  <img
                    src={operator.avatar}
                    alt={operator.name}
                    className="h-8 w-8 rounded-full object-cover border border-chrome-700"
                  />
                  <div className="truncate flex-1">
                    <div className="text-xs font-bold text-white font-mono truncate">
                      {operator.name}
                    </div>
                    <div className="text-[10px] text-chrome-500 font-mono truncate">
                      {operator.role}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-obsidian-800 flex items-center justify-between text-xs font-mono text-chrome-500">
                  <span>LAST TELEMETRY:</span>
                  <span className="text-white font-bold">
                    {new Date(device.lastSeen).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Registration Modal in Obsidian & Chrome */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-obsidian-950/90 backdrop-blur-md p-4">
          <div className="w-full max-w-md rounded-3xl bg-obsidian-900 border border-chrome-800 p-6 shadow-2xl">
            <h3 className="text-base font-black uppercase tracking-wider text-white font-mono mb-2">
              PROVISION NEW ESP32 HARDWARE
            </h3>
            <p className="text-xs text-chrome-400 mb-5 font-mono">
              Register hardware ID to generate encrypted HTTPS device tokens.
            </p>

            <form onSubmit={handleRegister} className="space-y-4 font-mono">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-chrome-400">
                  Hardware Node ID
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. KP004"
                  value={formData.deviceId}
                  onChange={(e) => setFormData({ ...formData, deviceId: e.target.value })}
                  className="mt-1.5 w-full rounded-xl border border-chrome-800 bg-obsidian-950 py-2.5 px-3.5 text-xs text-white focus:border-crimson-laser focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-chrome-400">
                  Designation / Plot
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. South Greenhouse Array"
                  value={formData.deviceName}
                  onChange={(e) => setFormData({ ...formData, deviceName: e.target.value })}
                  className="mt-1.5 w-full rounded-xl border border-chrome-800 bg-obsidian-950 py-2.5 px-3.5 text-xs text-white focus:border-crimson-laser focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-chrome-400">
                    Target Crop
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Tomato"
                    value={formData.cropType}
                    onChange={(e) => setFormData({ ...formData, cropType: e.target.value })}
                    className="mt-1.5 w-full rounded-xl border border-chrome-800 bg-obsidian-950 py-2.5 px-3.5 text-xs text-white focus:border-crimson-laser focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-chrome-400">
                    Agricultural Zone
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Sector 2B"
                    value={formData.zone}
                    onChange={(e) => setFormData({ ...formData, zone: e.target.value })}
                    className="mt-1.5 w-full rounded-xl border border-chrome-800 bg-obsidian-950 py-2.5 px-3.5 text-xs text-white focus:border-crimson-laser focus:outline-none"
                  />
                </div>
              </div>

              <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-obsidian-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-xl border border-chrome-800 px-4 py-2 text-xs font-bold text-chrome-400 hover:text-white"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-gradient-to-r from-crimson-laser to-rose-700 px-5 py-2 text-xs font-black uppercase text-white shadow-laser-sm hover:scale-105 transition"
                >
                  PROVISION & GENERATE KEY
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
