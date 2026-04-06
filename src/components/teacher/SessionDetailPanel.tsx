import React, { useMemo, useState } from 'react';

type Segment = {
  id: string;
  speaker: string;
  speakerLabel: string;
  start: number;
  text: string;
  relevant: boolean;
  confidence: number;
};

type Props = {
  segments: Segment[];
};

export default function SessionDetailPanel({ segments }: Props) {
  const [speakerFilter, setSpeakerFilter] = useState('all');
  const [relevance, setRelevance] = useState<'all' | 'relevant' | 'irrelevant'>('all');

  const speakerOptions = useMemo(() => Array.from(new Set(segments.map((segment) => segment.speakerLabel))), [segments]);

  const filtered = useMemo(() => {
    return segments.filter((segment) => {
      const bySpeaker = speakerFilter === 'all' ? true : segment.speakerLabel === speakerFilter;
      const byRelevance =
        relevance === 'all' ? true : relevance === 'relevant' ? segment.relevant : !segment.relevant;
      return bySpeaker && byRelevance;
    });
  }, [segments, speakerFilter, relevance]);

  const relevancePct = useMemo(() => {
    if (!segments.length) return 0;
    return (segments.filter((segment) => segment.relevant).length / segments.length) * 100;
  }, [segments]);

  const talkStats = useMemo(() => {
    const map = new Map<string, number>();
    segments.forEach((segment) => {
      map.set(segment.speakerLabel, (map.get(segment.speakerLabel) ?? 0) + 1);
    });
    const total = segments.length || 1;
    return [...map.entries()].map(([label, count]) => ({ label, pct: (count / total) * 100 }));
  }, [segments]);

  function downloadCsv() {
    const rows = [
      ['Timestamp', 'Speaker', 'Texto', 'Relevante', 'Confianza'],
      ...filtered.map((segment) => [
        fmt(segment.start),
        segment.speakerLabel,
        segment.text,
        segment.relevant ? 'Si' : 'No',
        `${Math.round(segment.confidence * 100)}%`
      ])
    ];

    const csv = rows.map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'session-detail.csv';
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <section style={{ display: 'grid', gap: '1rem' }}>
      <div className="card-surface" style={{ padding: '1rem', display: 'flex', flexWrap: 'wrap', gap: '0.8rem' }}>
        <select value={speakerFilter} onChange={(e) => setSpeakerFilter(e.target.value)} style={selectStyle}>
          <option value="all">Todos los speakers</option>
          {speakerOptions.map((label) => (
            <option key={label} value={label}>{label}</option>
          ))}
        </select>

        <select value={relevance} onChange={(e) => setRelevance(e.target.value as any)} style={selectStyle}>
          <option value="all">Toda relevancia</option>
          <option value="relevant">Solo relevantes</option>
          <option value="irrelevant">Solo filtrados</option>
        </select>

        <button className="interactive" onClick={downloadCsv} style={downloadBtn}>Descargar CSV</button>
      </div>

      <div className="card-surface" style={{ padding: '1rem' }}>
        <h3 className="mono" style={{ marginTop: 0 }}>Estadisticas</h3>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.3rem' }}>Distribucion de relevancia: {relevancePct.toFixed(1)}% relevante</p>
        <div style={{ marginTop: '0.7rem', display: 'grid', gap: '0.5rem' }}>
          {talkStats.map((entry) => (
            <div key={entry.label}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.86rem' }}>
                <span>{entry.label}</span>
                <span className="mono">{entry.pct.toFixed(1)}%</span>
              </div>
              <div style={{ height: '8px', borderRadius: '999px', overflow: 'hidden', background: 'rgba(100,116,139,.25)' }}>
                <div style={{ width: `${entry.pct}%`, height: '100%', background: 'var(--accent-cyan)' }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card-surface" style={{ padding: '1rem', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ color: 'var(--text-secondary)', textAlign: 'left' }}>
              <th>Timestamp</th>
              <th>Speaker</th>
              <th>Texto</th>
              <th>Relevante</th>
              <th>Confianza</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((segment) => (
              <tr key={segment.id} style={{ borderTop: '1px solid var(--border-subtle)' }}>
                <td>{fmt(segment.start)}</td>
                <td>{segment.speakerLabel}</td>
                <td>{segment.text}</td>
                <td>
                  <span className={`status-badge ${segment.relevant ? 'status-processed' : 'status-failed'}`}>
                    {segment.relevant ? 'Si' : 'No'}
                  </span>
                </td>
                <td>{Math.round(segment.confidence * 100)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

const selectStyle: React.CSSProperties = {
  background: 'var(--bg-elevated)',
  border: '1px solid var(--border-subtle)',
  borderRadius: 'var(--radius-sm)',
  color: 'var(--text-primary)',
  padding: '0.45rem 0.55rem'
};

const downloadBtn: React.CSSProperties = {
  border: '1px solid var(--border-subtle)',
  background: 'var(--bg-elevated)',
  color: 'var(--text-primary)',
  borderRadius: 'var(--radius-sm)',
  padding: '0.45rem 0.7rem',
  cursor: 'pointer'
};

function fmt(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60);
  const s = Math.floor(totalSeconds % 60);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}
