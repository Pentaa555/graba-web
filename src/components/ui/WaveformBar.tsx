import React, { useMemo } from 'react';

type WaveformBarProps = {
  bars?: number;
  color?: string;
  active?: boolean;
};

export default function WaveformBar({
  bars = 32,
  color = 'var(--accent-cyan)',
  active = true
}: WaveformBarProps) {
  const values = useMemo(() => Array.from({ length: bars }, () => 6 + Math.random() * 28), [bars]);

  return (
    <svg width="100%" height="64" viewBox={`0 0 ${bars * 6} 40`} preserveAspectRatio="none">
      <defs>
        <style>{`
          .wf-rect { transform-origin: center; animation: wave 0.9s ease-in-out infinite alternate; }
          @keyframes wave {
            0% { transform: scaleY(0.2); }
            100% { transform: scaleY(1); }
          }
        `}</style>
      </defs>
      {values.map((h, i) => (
        <rect
          key={i}
          className="wf-rect"
          x={i * 6 + 1}
          y={active ? 20 - h / 2 : 18}
          width="4"
          height={active ? h : 4}
          rx="2"
          fill={color}
          style={{ animationDelay: `${i * 0.04}s`, opacity: active ? 0.7 + (i % 4) * 0.08 : 0.3 }}
        />
      ))}
    </svg>
  );
}
