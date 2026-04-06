import React from 'react';

type Props = {
  teacherPercent: number;
  studentPercent: number;
};

export default function ParticipationChart({ teacherPercent, studentPercent }: Props) {
  return (
    <section className="card-surface" style={{ padding: '1rem' }}>
      <h3 className="mono" style={{ margin: 0 }}>Participacion por tiempo de habla</h3>
      <div style={{ marginTop: '1rem', display: 'grid', gap: '0.8rem' }}>
        <Bar label="Docente" pct={teacherPercent} color="var(--accent-cyan)" />
        <Bar label="Estudiantes" pct={studentPercent} color="var(--accent-violet)" />
      </div>
    </section>
  );
}

function Bar({ label, pct, color }: { label: string; pct: number; color: string }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem', fontSize: '0.9rem' }}>
        <span>{label}</span>
        <span className="mono">{pct.toFixed(1)}%</span>
      </div>
      <div style={{ height: '12px', background: 'rgba(100,116,139,.35)', borderRadius: '999px', overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: color }} />
      </div>
    </div>
  );
}
