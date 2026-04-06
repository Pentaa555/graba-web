import React, { useEffect, useMemo, useState } from 'react';
import WaveformBar from '../ui/WaveformBar';
import Modal from '../ui/Modal';

const steps = ['Extrayendo audio', 'Reduciendo ruido', 'Diarizando', 'Clasificando', 'Generando resumen'];

export default function SessionRecorder() {
  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [pipelineStep, setPipelineStep] = useState(-1);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    if (!recording) return;
    const timer = window.setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => window.clearInterval(timer);
  }, [recording]);

  const audioLevel = useMemo(() => (recording ? Math.floor(35 + Math.random() * 55) : 0), [recording, seconds]);

  function startRecording() {
    setSeconds(0);
    setPipelineStep(-1);
    setProcessing(false);
    setShowResult(false);
    setRecording(true);
  }

  function stopRecording() {
    setRecording(false);
    setProcessing(true);
    let index = 0;

    const run = () => {
      setPipelineStep(index);
      if (index < steps.length - 1) {
        index += 1;
        window.setTimeout(run, 900);
      } else {
        window.setTimeout(() => {
          setProcessing(false);
          setShowResult(true);
        }, 900);
      }
    };

    window.setTimeout(run, 500);
  }

  return (
    <section className="card-surface" style={{ padding: '1rem' }}>
      <h3 className="mono" style={{ marginTop: 0 }}>Grabacion de clase en vivo</h3>

      <div style={{ display: 'grid', placeItems: 'center', marginTop: '1rem', gap: '0.8rem' }}>
        {!recording ? (
          <button onClick={startRecording} style={recordButton}>● GRABAR</button>
        ) : (
          <button onClick={stopRecording} style={stopButton}>■ DETENER</button>
        )}

        <p className="mono" style={{ margin: 0, color: 'var(--text-secondary)' }}>{formatTime(seconds)}</p>
        <div style={{ width: '100%' }}>
          <WaveformBar active={recording} />
        </div>
        <p style={{ margin: 0, color: 'var(--text-secondary)' }}>Nivel de audio: {audioLevel}%</p>
      </div>

      {processing && (
        <div className="card-surface" style={{ marginTop: '1rem', padding: '0.8rem' }}>
          <p className="mono" style={{ margin: 0, color: 'var(--accent-amber)' }}>Procesando...</p>
          <ul style={{ margin: '0.65rem 0 0', paddingLeft: '1.2rem', color: 'var(--text-secondary)' }}>
            {steps.map((step, i) => (
              <li key={step} style={{ color: i <= pipelineStep ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                {step}
              </li>
            ))}
          </ul>
        </div>
      )}

      <Modal open={showResult} onClose={() => setShowResult(false)} title="Sesion procesada">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '0.65rem' }}>
          <Metric label="WER" value="12.8%" />
          <Metric label="DER" value="8.4%" />
          <Metric label="Segmentos relevantes" value="92/117" />
          <Metric label="Duracion" value={formatTime(seconds)} />
        </div>
      </Modal>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="card-surface" style={{ padding: '0.6rem' }}>
      <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.82rem' }}>{label}</p>
      <p className="mono" style={{ margin: '0.25rem 0 0', color: 'var(--accent-cyan)' }}>{value}</p>
    </div>
  );
}

function formatTime(total: number) {
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

const recordButton: React.CSSProperties = {
  width: '140px',
  height: '140px',
  borderRadius: '999px',
  border: '2px solid rgba(0,212,255,.5)',
  background: 'rgba(0,212,255,.14)',
  color: 'var(--text-primary)',
  cursor: 'pointer',
  fontWeight: 700,
  letterSpacing: '.05em'
};

const stopButton: React.CSSProperties = {
  ...recordButton,
  border: '2px solid rgba(239,68,68,.55)',
  background: 'rgba(239,68,68,.15)'
};
