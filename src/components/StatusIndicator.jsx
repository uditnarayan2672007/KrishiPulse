import React from 'react';

export const StatusIndicator = ({ status, label }) => {
  const isOnline = status === 'ONLINE' || status === 'ON' || status === 'CONNECTED';
  const isPending = status === 'PENDING' || status === 'CLAIMED';

  const dotColor = isOnline
    ? 'bg-crimson-laser shadow-[0_0_8px_#ff003b]'
    : isPending
    ? 'bg-chrome-400 animate-pulse'
    : 'bg-zinc-600';

  const textColor = isOnline
    ? 'text-crimson-400 font-semibold'
    : isPending
    ? 'text-chrome-300'
    : 'text-chrome-500';

  return (
    <div className="inline-flex items-center gap-2 text-xs font-mono">
      <span className={`h-2 w-2 rounded-full ${dotColor}`}></span>
      <span className={textColor}>{label || status}</span>
    </div>
  );
};
