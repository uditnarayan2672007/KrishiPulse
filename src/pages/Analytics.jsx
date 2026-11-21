import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  Calendar,
  Droplets,
  Clock,
  TrendingDown,
  CheckCircle2,
} from 'lucide-react';
import { useDevice } from '../context/DeviceContext';
import { apiClient } from '../services/api';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from 'recharts';

export const Analytics = () => {
  const { activeDeviceId } = useDevice();
  const [range, setRange] = useState('24h');
  const [historyData, setHistoryData] = useState([]);
  const [analyticsSummary, setAnalyticsSummary] = useState(null);
  const [irrigationLogs, setIrrigationLogs] = useState([]);

  useEffect(() => {
    let mounted = true;
    apiClient.getSensorHistory(activeDeviceId, range).then((data) => {
      if (mounted) setHistoryData(data);
    });

    apiClient.getAnalytics(activeDeviceId, range).then((res) => {
      if (mounted && res?.analytics) setAnalyticsSummary(res.analytics);
    });

    apiClient.getIrrigationHistory(activeDeviceId).then((logs) => {
      if (mounted) setIrrigationLogs(logs);
    });

    return () => {
      mounted = false;
    };
  }, [activeDeviceId, range]);

  return (
    <div className="space-y-6">
      {/* Header and Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black uppercase tracking-wider text-white font-mono">
            HISTORICAL TELEMETRY ANALYTICS
          </h1>
          <p className="text-xs text-chrome-400 mt-1 font-mono">
            Time-series dynamics, pump runtime cycles, and volumetric water conservation indices
          </p>
        </div>

        {/* Range Buttons in Obsidian & Chrome */}
        <div className="flex items-center gap-1.5 rounded-xl border border-chrome-800 bg-obsidian-950 p-1 font-mono">
          {['1h', '24h', '7d', '30d'].map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                range === r
                  ? 'bg-crimson-laser text-white shadow-laser-sm'
                  : 'text-chrome-400 hover:text-white'
              }`}
            >
              {r.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Aggregate Metrics Bar */}
      {analyticsSummary && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="rounded-2xl bg-gradient-to-b from-obsidian-850 to-obsidian-900 border border-chrome-800 p-4 shadow-chrome-card backdrop-blur-xl">
            <span className="text-[10px] font-bold text-chrome-400 uppercase font-mono">AVG MOISTURE</span>
            <div className="mt-2 text-2xl font-black text-crimson-laser font-mono">
              {analyticsSummary.averageSoilMoisture}%
            </div>
            <span className="text-[10px] text-chrome-500 font-mono">Window: {range}</span>
          </div>

          <div className="rounded-2xl bg-gradient-to-b from-obsidian-850 to-obsidian-900 border border-chrome-800 p-4 shadow-chrome-card backdrop-blur-xl">
            <span className="text-[10px] font-bold text-chrome-400 uppercase font-mono">PUMP RUNTIME</span>
            <div className="mt-2 text-2xl font-black text-white font-mono">
              {analyticsSummary.totalPumpRuntimeMinutes} MINS
            </div>
            <span className="text-[10px] text-chrome-500 font-mono">
              {analyticsSummary.totalIrrigationEvents} cycles audited
            </span>
          </div>

          <div className="rounded-2xl bg-gradient-to-b from-obsidian-850 to-obsidian-900 border border-chrome-800 p-4 shadow-chrome-card backdrop-blur-xl">
            <span className="text-[10px] font-bold text-chrome-400 uppercase font-mono">WATER CONSERVED</span>
            <div className="mt-2 text-2xl font-black text-chrome-100 font-mono">
              ~{analyticsSummary.estimatedWaterSavedLiters} L
            </div>
            <span className="text-[10px] text-chrome-500 font-mono">Vs unmetered flood</span>
          </div>

          <div className="rounded-2xl bg-gradient-to-b from-obsidian-850 to-obsidian-900 border border-crimson-laser/40 p-4 shadow-laser-sm backdrop-blur-xl">
            <span className="text-[10px] font-bold text-crimson-laser uppercase font-mono">EFFICIENCY SCORE</span>
            <div className="mt-2 text-2xl font-black text-white font-mono">
              {analyticsSummary.irrigationEfficiencyScore}%
            </div>
            <span className="text-[10px] text-chrome-500 font-mono">Target adherence</span>
          </div>
        </div>
      )}

      {/* Comprehensive Time-Series Chart in Laser Crimson & Chrome Silver */}
      <div className="rounded-2xl bg-gradient-to-b from-obsidian-850 to-obsidian-900 border border-chrome-800 p-6 shadow-2xl backdrop-blur-xl">
        <h2 className="text-sm font-black uppercase tracking-wider text-white font-mono mb-1">
          SOIL HYDRATION & ENVIRONMENTAL TELEMETRY ({range.toUpperCase()})
        </h2>
        <p className="text-xs text-chrome-400 mb-6">
          Laser Crimson (Soil Moisture %), Chrome Silver (Temperature °C), Steel Blue (RH %)
        </p>

        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={historyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
                  color: '#ffffff',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px', fontFamily: 'monospace' }} />
              <Line
                type="monotone"
                dataKey="soilMoisture"
                stroke="#ff003b"
                strokeWidth={2.5}
                dot={false}
                name="Soil Moisture (%)"
              />
              <Line
                type="monotone"
                dataKey="temperature"
                stroke="#cbd5e1"
                strokeWidth={1.8}
                dot={false}
                name="Temperature (°C)"
              />
              <Line
                type="monotone"
                dataKey="humidity"
                stroke="#64748b"
                strokeWidth={1.8}
                dot={false}
                name="Humidity (%)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Historical Irrigation Events Table in Obsidian Black */}
      <div className="rounded-2xl bg-gradient-to-b from-obsidian-850 to-obsidian-900 border border-chrome-800 p-6 shadow-2xl backdrop-blur-xl">
        <h2 className="text-sm font-black uppercase tracking-wider text-white font-mono mb-1">
          CONFIRMED IRRIGATION RUNS
        </h2>
        <p className="text-xs text-chrome-400 mb-4 font-mono">
          Hardware-acknowledged runtimes and termination triggers stored in MongoDB Atlas
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-obsidian-950 text-chrome-500 border-b border-obsidian-800">
              <tr>
                <th className="p-3">EVENT ID</th>
                <th className="p-3">NODE</th>
                <th className="p-3">MODE</th>
                <th className="p-3">START TIME</th>
                <th className="p-3">DURATION</th>
                <th className="p-3">STATUS</th>
                <th className="p-3">STOP TRIGGER</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-obsidian-800 text-chrome-300">
              {irrigationLogs.map((item) => (
                <tr key={item.id} className="hover:bg-obsidian-800/40 transition">
                  <td className="p-3 font-medium text-crimson-laser">{item.id}</td>
                  <td className="p-3 text-white font-bold">{item.deviceId}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-obsidian-950 border border-chrome-800">
                      {item.operatingMode}
                    </span>
                  </td>
                  <td className="p-3 text-chrome-400">{new Date(item.startTime).toLocaleString()}</td>
                  <td className="p-3 font-bold text-white">{item.durationSeconds}s</td>
                  <td className="p-3">
                    <span className="inline-flex items-center gap-1 text-white font-bold">
                      <CheckCircle2 className="h-3.5 w-3.5 text-crimson-laser" />
                      {item.status}
                    </span>
                  </td>
                  <td className="p-3 text-chrome-400">{item.stopReason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
