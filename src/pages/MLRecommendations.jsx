import React, { useState, useEffect } from 'react';
import {
  BrainCircuit,
  Sliders,
  Sparkles,
  Droplets,
  Thermometer,
  CloudRain,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  History,
  Zap,
  Layers,
  Leaf,
  Scan,
} from 'lucide-react';
import { useDevice } from '../context/DeviceContext';
import { apiClient } from '../services/api';
import { calculateMLRecommendation } from '../services/mockData';

export const MLRecommendations = () => {
  const { activeDeviceId, dashboardData } = useDevice();
  const dash = dashboardData?.dashboard || {};

  // Interactive What-If Simulator State
  const [simMoisture, setSimMoisture] = useState(dash.soilMoisture ?? 32);
  const [simTemp, setSimTemp] = useState(dash.temperature ?? 30);
  const [simHumidity, setSimHumidity] = useState(dash.humidity ?? 55);

  const [activePrediction, setActivePrediction] = useState(
    calculateMLRecommendation(simMoisture, simTemp, simHumidity)
  );

  const [predictionLogs, setPredictionLogs] = useState([
    {
      id: 'PRED-891',
      moisture: 28.4,
      temp: 32.1,
      humidity: 48,
      irrigationRequired: true,
      confidence: 0.96,
      recommendation: 'Critical soil moisture depletion. Immediate actuation advised.',
      timestamp: 'Today, 11:20 AM',
    },
    {
      id: 'PRED-890',
      moisture: 42.0,
      temp: 27.5,
      humidity: 65,
      irrigationRequired: false,
      confidence: 0.92,
      recommendation: 'Hydration equilibrium maintained. Suspend irrigation.',
      timestamp: 'Today, 08:00 AM',
    },
    {
      id: 'PRED-889',
      moisture: 36.8,
      temp: 31.0,
      humidity: 52,
      irrigationRequired: true,
      confidence: 0.88,
      recommendation: 'Moderate moisture deficit under high ambient evaporative stress.',
      timestamp: 'Yesterday, 04:30 PM',
    },
  ]);

  const runSimulation = () => {
    const res = calculateMLRecommendation(simMoisture, simTemp, simHumidity);
    setActivePrediction(res);
  };

  useEffect(() => {
    runSimulation();
  }, [simMoisture, simTemp, simHumidity]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black uppercase tracking-wider text-white font-mono">
          SCIKIT-LEARN PREDICTIVE MATRIX
        </h1>
        <p className="text-xs text-chrome-400 mt-1 font-mono">
          Multi-variate Random Forest & Decision Tree regression analyzing evaporative crop stress
        </p>
      </div>

      {/* Row 1: Crop Health Computer Vision HUD & ML Lead Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Computer Vision Crop Photo Inspector */}
        <div className="lg:col-span-8 rounded-3xl bg-obsidian-900 border border-chrome-800 p-6 shadow-2xl relative overflow-hidden backdrop-blur-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Scan className="h-4 w-4 text-crimson-laser" />
              <h2 className="text-xs font-black uppercase tracking-wider text-white font-mono">
                SPECTRAL CROP CANOPY SCANNER // ACTIVE PARCEL
              </h2>
            </div>
            <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-crimson-950 text-crimson-laser border border-crimson-laser/40">
              NDVI HEALTH: 0.84 (OPTIMAL)
            </span>
          </div>

          <div className="relative h-64 w-full rounded-2xl overflow-hidden border border-obsidian-750">
            <img
              src="https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=1200&q=80"
              alt="Crop Canopy Close-up"
              className="h-full w-full object-cover brightness-75 contrast-125"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950/80 via-transparent to-transparent"></div>

            {/* Target Reticle */}
            <div className="absolute top-8 left-8 p-3 rounded-2xl bg-obsidian-950/85 border border-crimson-laser/50 backdrop-blur-md text-[10px] font-mono shadow-laser-sm">
              <div className="font-bold text-white uppercase">ZONE 4A CANOPY</div>
              <div className="text-crimson-laser font-black">TRANSPIRATION RATE: 4.8 mm/day</div>
            </div>

            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between p-3 rounded-xl bg-obsidian-950/90 border border-chrome-800 text-xs font-mono">
              <span className="text-chrome-300">PHENOLOGICAL STAGE: TILLERING / VEGETATIVE</span>
              <span className="text-emerald-400 font-bold">STRESS INDEX: LOW</span>
            </div>
          </div>
        </div>

        {/* Lead AI Hydrologist Card with Avatar */}
        <div className="lg:col-span-4 rounded-3xl bg-gradient-to-b from-obsidian-850 to-obsidian-900 border border-chrome-800 p-6 shadow-2xl flex flex-col justify-between backdrop-blur-xl">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-chrome-400 font-mono">
                AI SYSTEMS LEAD
              </span>
              <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
            </div>

            <div className="flex items-center gap-3.5 mb-4">
              <img
                src="https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80"
                alt="Dr. Sarah Chen"
                className="h-14 w-14 rounded-2xl object-cover border-2 border-crimson-laser shadow-laser-sm"
              />
              <div>
                <h3 className="text-sm font-black text-white font-mono">Dr. Sarah Chen</h3>
                <p className="text-[11px] text-crimson-laser font-mono font-bold">
                  Hydrology & Soil AI Specialist
                </p>
                <p className="text-[10px] text-chrome-500 font-mono">Ph.D. Agrisystems Robotics</p>
              </div>
            </div>

            <p className="text-xs text-chrome-300 leading-relaxed font-sans mb-4">
              "The current Scikit-learn model incorporates Penman-Monteith potential evapotranspiration equations directly into the Random Forest decision trees."
            </p>
          </div>

          <div className="pt-4 border-t border-obsidian-800 text-[10px] font-mono text-chrome-500 flex items-center justify-between">
            <span>PIPELINE:</span>
            <span className="text-white font-bold">FASTAPI + JOBLIB</span>
          </div>
        </div>
      </div>

      {/* Primary Model Status & Live Output */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Prediction Banner */}
        <div className="lg:col-span-2 rounded-3xl bg-gradient-to-b from-obsidian-850 to-obsidian-900 border border-chrome-800 p-6 shadow-2xl relative overflow-hidden backdrop-blur-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-xl bg-crimson-950 text-crimson-laser border border-crimson-laser/40 flex items-center justify-center shadow-laser-sm">
                <BrainCircuit className="h-4 w-4" />
              </div>
              <h2 className="text-xs font-black uppercase tracking-wider text-white font-mono">
                Real-Time Inference Output
              </h2>
            </div>
            <span className="text-[10px] font-mono px-3 py-1 rounded-full bg-obsidian-950 text-crimson-laser border border-crimson-laser/30 shadow-laser-sm">
              FASTAPI MICROSERVICE
            </span>
          </div>

          <div
            className={`rounded-2xl p-5 border ${
              activePrediction.irrigationRequired
                ? 'bg-crimson-950/30 border-crimson-laser/50 shadow-laser-sm'
                : 'bg-obsidian-950 border-chrome-700/50'
            }`}
          >
            <div className="flex items-start gap-3">
              {activePrediction.irrigationRequired ? (
                <Zap className="h-6 w-6 text-crimson-laser shrink-0 mt-0.5 animate-pulse" />
              ) : (
                <CheckCircle2 className="h-6 w-6 text-chrome-300 shrink-0 mt-0.5" />
              )}
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="text-sm font-black text-white font-mono uppercase tracking-wide">
                    {activePrediction.irrigationRequired
                      ? 'ACTUATION REQUIRED // HIGH WATER DEFICIT'
                      : 'EQUILIBRIUM MAINTAINED // HOLD WATER'}
                  </h3>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                      activePrediction.urgency === 'HIGH'
                        ? 'bg-crimson-laser text-white shadow-laser-sm'
                        : activePrediction.urgency === 'MODERATE'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-obsidian-900 text-chrome-300 border border-chrome-700'
                    }`}
                  >
                    STATUS: {activePrediction.urgency}
                  </span>
                </div>
                <p className="text-xs text-chrome-300 mt-2 leading-relaxed font-mono">
                  {activePrediction.recommendation}
                </p>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-obsidian-800 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs font-mono">
              <div>
                <span className="text-chrome-500 block">CONFIDENCE:</span>
                <span className="text-lg font-black text-crimson-laser">
                  {Math.round(activePrediction.confidence * 100)}%
                </span>
              </div>
              <div>
                <span className="text-chrome-500 block">WATER DEFICIT:</span>
                <span className="text-lg font-black text-white">
                  {activePrediction.waterNeedLiters > 0
                    ? `~${activePrediction.waterNeedLiters} L`
                    : '0 LITERS'}
                </span>
              </div>
              <div>
                <span className="text-chrome-500 block">ALGORITHM:</span>
                <span className="text-xs text-chrome-300 font-bold">RandomForestClassifier</span>
              </div>
            </div>
          </div>
        </div>

        {/* What-If Feature Simulator */}
        <div className="rounded-3xl bg-gradient-to-b from-obsidian-850 to-obsidian-900 border border-chrome-800 p-6 shadow-2xl flex flex-col justify-between backdrop-blur-xl">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Sliders className="h-5 w-5 text-crimson-laser" />
              <h2 className="text-xs font-black uppercase tracking-wider text-white font-mono">
                Interactive Test Bench
              </h2>
            </div>
            <p className="text-xs text-chrome-400 mb-5 font-mono">
              Simulate soil & weather inputs to evaluate real-time inference.
            </p>

            <div className="space-y-4 font-mono">
              <div>
                <div className="flex justify-between text-xs font-bold text-chrome-300 mb-1">
                  <span>SOIL MOISTURE:</span>
                  <span className="font-black text-crimson-laser">{simMoisture}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="80"
                  value={simMoisture}
                  onChange={(e) => setSimMoisture(Number(e.target.value))}
                  className="w-full accent-crimson-laser cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-chrome-300 mb-1">
                  <span>TEMPERATURE:</span>
                  <span className="font-black text-white">{simTemp}°C</span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="45"
                  value={simTemp}
                  onChange={(e) => setSimTemp(Number(e.target.value))}
                  className="w-full accent-chrome-400 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-chrome-300 mb-1">
                  <span>HUMIDITY:</span>
                  <span className="font-black text-chrome-400">{simHumidity}%</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="95"
                  value={simHumidity}
                  onChange={(e) => setSimHumidity(Number(e.target.value))}
                  className="w-full accent-chrome-400 cursor-pointer"
                />
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              setSimMoisture(dash.soilMoisture ?? 35);
              setSimTemp(dash.temperature ?? 28);
              setSimHumidity(dash.humidity ?? 60);
            }}
            className="mt-5 w-full rounded-xl border border-chrome-800 bg-obsidian-950 py-2.5 text-xs font-mono font-bold uppercase tracking-wider text-chrome-300 hover:border-crimson-laser hover:text-white transition"
          >
            RESET TO LIVE TELEMETRY
          </button>
        </div>
      </div>

      {/* Historical Inferences Table */}
      <div className="rounded-3xl bg-gradient-to-b from-obsidian-850 to-obsidian-900 border border-chrome-800 p-6 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center gap-2 mb-4">
          <History className="h-5 w-5 text-crimson-laser" />
          <h2 className="text-xs font-black uppercase tracking-wider text-white font-mono">
            Historical Inference Records
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-obsidian-950 text-chrome-500 border-b border-obsidian-800">
              <tr>
                <th className="p-3">INFERENCE ID</th>
                <th className="p-3">MOISTURE</th>
                <th className="p-3">TEMP / RH</th>
                <th className="p-3">DECISION</th>
                <th className="p-3">CONFIDENCE</th>
                <th className="p-3">ADVISORY</th>
                <th className="p-3">TIMESTAMP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-obsidian-800 text-chrome-300">
              {predictionLogs.map((log) => (
                <tr key={log.id} className="hover:bg-obsidian-800/40 transition">
                  <td className="p-3 font-medium text-crimson-laser">{log.id}</td>
                  <td className="p-3 font-bold text-white">{log.moisture}%</td>
                  <td className="p-3">
                    {log.temp}°C / {log.humidity}%
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        log.irrigationRequired
                          ? 'bg-crimson-950 text-crimson-laser border border-crimson-laser/40'
                          : 'bg-obsidian-950 text-chrome-400 border border-chrome-800'
                      }`}
                    >
                      {log.irrigationRequired ? 'IRRIGATE' : 'HOLD'}
                    </span>
                  </td>
                  <td className="p-3 font-bold text-white">
                    {Math.round(log.confidence * 100)}%
                  </td>
                  <td className="p-3 text-chrome-400 max-w-xs truncate">{log.recommendation}</td>
                  <td className="p-3 text-chrome-500">{log.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
