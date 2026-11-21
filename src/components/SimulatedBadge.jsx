import React from 'react';
import { Radio } from 'lucide-react';

export const SimulatedBadge = ({ className = '' }) => {
  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-semibold bg-obsidian-900/90 text-chrome-200 border border-crimson-laser/40 shadow-laser-sm backdrop-blur-md ${className}`}
      title="High-precision telemetry simulation running in standby for ESP32 connection."
    >
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-crimson-laser opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-crimson-laser"></span>
      </span>
      <span className="tracking-wide">
        SIMULATED <span className="text-crimson-laser font-bold">TELEMETRY</span>
      </span>
    </div>
  );
};
