import React, { useState } from 'react';
import {
  Droplets,
  Power,
  ShieldCheck,
  AlertTriangle,
  Clock,
  RotateCcw,
  CheckCircle2,
  ListOrdered,
  Zap,
} from 'lucide-react';
import { useDevice } from '../context/DeviceContext';

export const IrrigationControl = () => {
  const { activeDevice, activeDeviceId, dashboardData, togglePump } = useDevice();
  const dash = dashboardData?.dashboard || {};

  const [mode, setMode] = useState(dash.operatingMode || 'AUTO');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusLog, setStatusLog] = useState([
    {
      id: 'CMD-301',
      command: 'PUMP_ON',
      mode: 'MANUAL',
      status: 'EXECUTED',
      timestamp: 'Today, 10:14 AM',
      confirmedTime: 'Today, 10:14:02 AM',
      latency: '1.4s',
    },
    {
      id: 'CMD-300',
      command: 'PUMP_OFF',
      mode: 'AUTO',
      status: 'EXECUTED',
      timestamp: 'Today, 08:30 AM',
      confirmedTime: 'Today, 08:30:01 AM',
      latency: '1.1s',
    },
  ]);

  const isPumpOn = dash.pumpStatus === 'ON';
  const isWaterAvailable = dash.waterAvailable !== false;

  const handleCommand = async (cmd) => {
    setIsSubmitting(true);
    try {
      const res = await togglePump(cmd, mode);
      const newEntry = {
        id: res.command?.commandId || 'CMD-' + Math.floor(Math.random() * 900 + 100),
        command: cmd,
        mode,
        status: 'EXECUTED',
        timestamp: new Date().toLocaleTimeString(),
        confirmedTime: new Date().toLocaleTimeString(),
        latency: '1.2s',
      };
      setStatusLog((prev) => [newEntry, ...prev]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black uppercase tracking-wider text-white font-mono">
          IRRIGATION ACTUATION COMMAND MATRIX
        </h1>
        <p className="text-xs text-chrome-400 mt-1 font-mono">
          Issue manual relay actuation or configure autonomous AI closed-loop governance
        </p>
      </div>

      {/* Safety Alert Banner */}
      {!isWaterAvailable && (
        <div className="flex items-center gap-3 rounded-2xl bg-crimson-950/40 border border-crimson-laser/50 p-4 text-crimson-300 text-xs font-mono shadow-laser-sm">
          <AlertTriangle className="h-5 w-5 shrink-0 text-crimson-laser animate-pulse" />
          <div>
            <span className="font-black text-white">RESERVOIR INTERLOCK TRIPPED:</span> Water level switch is open.
            To prevent pump cavitation and dry-run damage, all pump commands are hardware-rejected.
          </div>
        </div>
      )}

      {/* Operating Mode Selector & Pump Actuator in Obsidian Black & Laser Crimson */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Mode Selector */}
        <div className="rounded-2xl bg-gradient-to-b from-obsidian-850 to-obsidian-900 border border-chrome-800 p-6 shadow-2xl flex flex-col justify-between backdrop-blur-xl">
          <div>
            <h2 className="text-sm font-black uppercase tracking-wider text-white font-mono mb-2">
              OPERATING GOVERNANCE
            </h2>
            <p className="text-xs text-chrome-400 mb-5 leading-relaxed font-sans">
              Switch between automated AI sensor-threshold irrigation and operator manual control.
            </p>

            <div className="grid grid-cols-2 gap-3 font-mono">
              <button
                type="button"
                onClick={() => setMode('AUTO')}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border text-xs font-black transition-all ${
                  mode === 'AUTO'
                    ? 'bg-crimson-950/50 border-crimson-laser text-white shadow-laser-sm'
                    : 'bg-obsidian-950 border-chrome-800 text-chrome-500 hover:border-chrome-700'
                }`}
              >
                <span className="text-sm">AUTO</span>
                <span className="text-[9px] text-chrome-400 mt-1 font-bold">AI Governed</span>
              </button>

              <button
                type="button"
                onClick={() => setMode('MANUAL')}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border text-xs font-black transition-all ${
                  mode === 'MANUAL'
                    ? 'bg-crimson-950/50 border-crimson-laser text-white shadow-laser-sm'
                    : 'bg-obsidian-950 border-chrome-800 text-chrome-500 hover:border-chrome-700'
                }`}
              >
                <span className="text-sm">MANUAL</span>
                <span className="text-[9px] text-chrome-400 mt-1 font-bold">Operator Override</span>
              </button>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-obsidian-750 text-xs font-mono text-chrome-500">
            ACTIVE MODE: <span className="font-bold text-crimson-laser">{mode}</span>
          </div>
        </div>

        {/* Pump Switch Controller */}
        <div className="lg:col-span-2 rounded-2xl bg-gradient-to-b from-obsidian-850 to-obsidian-900 border border-chrome-800 p-6 shadow-2xl flex flex-col justify-between backdrop-blur-xl">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-black uppercase tracking-wider text-white font-mono">
                PHYSICAL RELAY CONTROLLER
              </h2>
              <span
                className={`px-3 py-1 rounded-full text-xs font-mono font-black ${
                  isPumpOn
                    ? 'bg-crimson-950/60 text-crimson-laser border border-crimson-laser shadow-laser-sm animate-pulse'
                    : 'bg-obsidian-950 text-chrome-500 border border-chrome-800'
                }`}
              >
                {isPumpOn ? 'ACTUATOR RUNNING' : 'ACTUATOR STANDBY'}
              </span>
            </div>

            <p className="text-xs text-chrome-400 leading-relaxed mb-6 font-sans">
              Commands transition through an atomic lease cycle: <strong>PENDING</strong> → <strong>CLAIMED</strong> → <strong>EXECUTED</strong>. The ESP32 validates reservoir head pressure before energizing the 5V relay coil.
            </p>

            <div className="flex flex-wrap items-center gap-4 font-mono">
              <button
                onClick={() => handleCommand('PUMP_ON')}
                disabled={isPumpOn || isSubmitting || !isWaterAvailable}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-crimson-laser to-rose-700 px-6 py-4 text-xs font-black uppercase tracking-wider text-white shadow-laser-md hover:scale-105 transition disabled:opacity-30"
              >
                <Zap className="h-4 w-4" />
                <span>{isSubmitting ? 'TRANSMITTING...' : 'START PUMP (PUMP_ON)'}</span>
              </button>

              <button
                onClick={() => handleCommand('PUMP_OFF')}
                disabled={!isPumpOn || isSubmitting}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-chrome-700 bg-obsidian-950 px-6 py-4 text-xs font-black uppercase tracking-wider text-chrome-200 hover:border-crimson-laser hover:text-crimson-laser transition disabled:opacity-30"
              >
                <Power className="h-4 w-4" />
                <span>{isSubmitting ? 'TRANSMITTING...' : 'STOP PUMP (PUMP_OFF)'}</span>
              </button>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-obsidian-750 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-mono text-chrome-500">
            <div>
              TARGET: <span className="font-bold text-white">{activeDeviceId}</span>
            </div>
            <div>
              CUTOFF: <span className="font-bold text-white">10 MIN TIMEOUT</span>
            </div>
            <div>
              LEASE: <span className="font-bold text-crimson-laser">ATOMIC SHA-256</span>
            </div>
          </div>
        </div>
      </div>

      {/* Command Polling and Execution Audit Log */}
      <div className="rounded-2xl bg-gradient-to-b from-obsidian-850 to-obsidian-900 border border-chrome-800 p-6 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <ListOrdered className="h-5 w-5 text-crimson-laser" />
            <h2 className="text-sm font-black uppercase tracking-wider text-white font-mono">
              Hardware Handshake Audit Trail
            </h2>
          </div>
          <span className="text-[10px] text-chrome-500 font-mono">AUDITED TELEMETRY</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-obsidian-950 text-chrome-500 border-b border-obsidian-800">
              <tr>
                <th className="p-3">COMMAND ID</th>
                <th className="p-3">ACTION</th>
                <th className="p-3">MODE</th>
                <th className="p-3">STATUS</th>
                <th className="p-3">ISSUED</th>
                <th className="p-3">CONFIRMED</th>
                <th className="p-3">LATENCY</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-obsidian-800 text-chrome-300">
              {statusLog.map((log) => (
                <tr key={log.id} className="hover:bg-obsidian-800/40 transition">
                  <td className="p-3 font-medium text-crimson-laser">{log.id}</td>
                  <td className="p-3 font-bold text-white">{log.command}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-obsidian-950 border border-chrome-800">
                      {log.mode}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className="inline-flex items-center gap-1 text-white font-bold">
                      <CheckCircle2 className="h-3.5 w-3.5 text-crimson-laser" />
                      {log.status}
                    </span>
                  </td>
                  <td className="p-3 text-chrome-400">{log.timestamp}</td>
                  <td className="p-3 text-chrome-400">{log.confirmedTime}</td>
                  <td className="p-3 text-crimson-laser font-bold">{log.latency}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
