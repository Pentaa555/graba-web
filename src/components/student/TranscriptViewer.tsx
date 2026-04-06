import React, { useMemo, useState } from 'react';

type Segment = {
  id: string;
  speaker: 'docente' | 'estudiante';
  speakerLabel: string;
  start: number;
  end: number;
  text: string;
  relevant: boolean;
  confidence: number;
  topics: string[];
};

type Props = {
  segments: Segment[];
  currentTime: number;
  onSeek: (time: number) => void;
};

export default function TranscriptViewer({ segments, currentTime, onSeek }: Props) {
  const [academicOnly, setAcademicOnly] = useState(false);

  const filtered = useMemo(
    () => (academicOnly ? segments.filter((segment) => segment.relevant) : segments),
    [academicOnly, segments]
  );

  return (
    <section className="card-surface" style={{ padding: '1rem', marginTop: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
        <h3 className="mono" style={{ margin: 0 }}>Transcripcion</h3>
        <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
          <input type="checkbox" checked={academicOnly} onChange={(e) => setAcademicOnly(e.target.checked)} />
          Mostrar solo contenido academico
        </label>
      </div>

      <div style={{ maxHeight: '320px', overflow: 'auto', marginTop: '0.9rem', display: 'grid', gap: '0.55rem' }}>
        {filtered.map((segment) => {
          const active = currentTime >= segment.start && currentTime <= segment.end;
          const speakerTone = segment.speaker === 'docente' ? 'rgba(0,212,255,0.22)' : 'rgba(139,92,246,0.22)';

          return (
            <article
              key={segment.id}
              className="interactive"
              style={{
                border: `1px solid ${active ? 'var(--border-active)' : 'var(--border-subtle)'}`,
                borderRadius: 'var(--radius-sm)',
                background: active ? 'rgba(0,212,255,0.08)' : 'var(--bg-elevated)',
                padding: '0.6rem 0.7rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.7rem' }}>
                <button
                  onClick={() => onSeek(Math.floor(segment.start))}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    color: 'var(--accent-cyan)',
                    cursor: 'pointer',
                    fontFamily: 'IBM Plex Mono, monospace'
                  }}
                >
                  {fmt(segment.start)}
                </button>
                <span
                  style={{
                    padding: '0.18rem 0.45rem',
                    borderRadius: '999px',
                    fontSize: '0.75rem',
                    border: '1px solid var(--border-subtle)',
                    background: !segment.relevant ? 'rgba(239,68,68,0.25)' : speakerTone,
                    textDecoration: !segment.relevant ? 'line-through' : 'none'
                  }}
                >
                  {segment.speakerLabel}
                </span>
              </div>
              <p style={{ margin: '0.4rem 0 0', color: 'var(--text-primary)', fontSize: '0.92rem' }}>{segment.text}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function fmt(v: number) {
  const m = Math.floor(v / 60);
  const s = Math.floor(v % 60);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}
