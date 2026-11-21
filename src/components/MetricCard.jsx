import React from 'react';

export const MetricCard = ({
  title,
  value,
  unit = '',
  icon: Icon,
  trend,
  trendLabel,
  color = 'crimson',
  subtitle,
  badge,
}) => {
  const colorMap = {
    crimson: {
      border: 'border-crimson-laser/30 hover:border-crimson-laser/60 shadow-laser-sm',
      iconBg: 'bg-crimson-950/40 text-crimson-laser border-crimson-laser/40 shadow-laser-sm',
      value: 'text-chrome-100',
      accent: 'text-crimson-laser',
    },
    chrome: {
      border: 'border-chrome-700/40 hover:border-chrome-400/50 shadow-chrome-sm',
      iconBg: 'bg-obsidian-800 text-chrome-300 border-chrome-600/40',
      value: 'text-chrome-100',
      accent: 'text-chrome-400',
    },
    silver: {
      border: 'border-zinc-700/50 hover:border-zinc-400/50',
      iconBg: 'bg-zinc-900 text-zinc-200 border-zinc-600/50',
      value: 'text-white',
      accent: 'text-zinc-400',
    },
  };

  const scheme = colorMap[color] || colorMap.crimson;

  return (
    <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-b from-obsidian-850 to-obsidian-900 border p-5 transition-all duration-300 hover:-translate-y-0.5 backdrop-blur-xl ${scheme.border}`}>
      {/* Chrome Silver Top Sheen */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-chrome-400/30 to-transparent"></div>

      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold uppercase tracking-widest text-chrome-400">{title}</span>
        {Icon && (
          <div className={`flex h-10 w-10 items-center justify-center rounded-xl border ${scheme.iconBg}`}>
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>

      <div className="mt-4 flex items-baseline gap-2">
        <span className={`text-3xl font-black tracking-tight ${scheme.value}`}>{value}</span>
        {unit && <span className="text-sm font-bold text-chrome-400 font-mono">{unit}</span>}
      </div>

      {(subtitle || trend || badge) && (
        <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-obsidian-750">
          {subtitle && <span className="text-chrome-500 font-medium">{subtitle}</span>}
          {badge && <div>{badge}</div>}
          {trend && (
            <span
              className={`font-semibold font-mono ${trend.startsWith('+') ? 'text-crimson-laser' : 'text-chrome-300'
                }`}
            >
              {trend} {trendLabel}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
