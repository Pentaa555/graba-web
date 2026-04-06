import React, { useEffect, useMemo, useState } from 'react';
import { Pause, Play } from 'lucide-react';

type VideoPlayerProps = {
  duration: number;
  currentTime: number;
  onTimeChange: (t: number) => void;
};

export default function VideoPlayer({ duration, currentTime, onTimeChange }: VideoPlayerProps) {
  const [playing, setPlaying] = useState(false);
  const [localTime, setLocalTime] = useState(currentTime);

  useEffect(() => {
    setLocalTime(currentTime);
  }, [currentTime]);

  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => {
      setLocalTime((prev) => {
        const next = Math.min(prev + 1, duration);
        onTimeChange(next);
        if (next >= duration) {
          setPlaying(false);
        }
        return next;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [playing, duration, onTimeChange]);

  const pct = useMemo(() => (duration ? (localTime / duration) * 100 : 0), [duration, localTime]);

  return (
    <section className="card-surface" style={{ padding: '1rem' }}>
      <div style={{
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        height: '220px',
        background: 'linear-gradient(135deg, rgba(0,212,255,.08), rgba(139,92,246,.12))',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <svg width="100%" height="100%" viewBox="0 0 800 300" preserveAspectRatio="none">
          <rect x="20" y="20" width="760" height="260" rx="20" fill="rgba(8,12,24,.75)" stroke="rgba(0,212,255,.35)" />
          <path d="M40 230 C 160 110, 280 260, 400 150 C 520 40, 640 260, 760 140" stroke="rgba(0,212,255,.6)" strokeWidth="4" fill="none">
            <animate attributeName="d" dur="3s" repeatCount="indefinite"
              values="M40 230 C 160 110, 280 260, 400 150 C 520 40, 640 260, 760 140;
                      M40 210 C 180 70, 260 280, 410 170 C 560 80, 620 240, 760 130;
                      M40 230 C 160 110, 280 260, 400 150 C 520 40, 640 260, 760 140" />
          </path>
        </svg>
        <span style={{
          position: 'absolute',
          left: '1rem',
          top: '1rem',
          fontSize: '0.8rem',
          color: 'var(--text-secondary)'
        }}>Simulador de video de clase</span>
      </div>

      <div style={{ marginTop: '1rem', display: 'grid', gap: '0.7rem' }}>
        <div
          role="slider"
          aria-valuemin={0}
          aria-valuemax={duration}
          aria-valuenow={localTime}
          onClick={(event) => {
            const target = event.currentTarget as HTMLDivElement;
            const rect = target.getBoundingClientRect();
            const ratio = (event.clientX - rect.left) / rect.width;
            const next = Math.max(0, Math.min(duration, Math.round(duration * ratio)));
            setLocalTime(next);
            onTimeChange(next);
          }}
          style={{
            width: '100%',
            height: '10px',
            borderRadius: '999px',
            background: 'rgba(100,116,139,.3)',
            overflow: 'hidden',
            cursor: 'pointer'
          }}
        >
          <div style={{ width: `${pct}%`, height: '100%', background: 'var(--accent-cyan)' }} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            className="interactive"
            onClick={() => setPlaying((v) => !v)}
            style={{
              border: '1px solid var(--border-subtle)',
              background: 'var(--bg-elevated)',
              color: 'var(--text-primary)',
              borderRadius: '999px',
              width: '42px',
              height: '42px',
              display: 'grid',
              placeItems: 'center',
              cursor: 'pointer'
            }}
          >
            {playing ? <Pause size={18} /> : <Play size={18} />}
          </button>

          <p className="mono" style={{ margin: 0, color: 'var(--text-secondary)' }}>
            {fmt(localTime)} / {fmt(duration)}
          </p>
        </div>
      </div>
    </section>
  );
}

function fmt(value: number) {
  const m = Math.floor(value / 60);
  const s = value % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}
