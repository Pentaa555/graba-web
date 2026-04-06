import React, { useEffect, useMemo, useState } from 'react';

const baseLogs = [
  '[INFO] Init pipeline orchestrator',
  '[INFO] FFmpeg worker ready',
  '[INFO] DeepFilterNet model loaded',
  '[INFO] WhisperX model warm-up complete',
  '[INFO] pyannote diarization ready',
  '[INFO] BETO relevance classifier active'
];

const dynamicEvents = [
  'Task sess-008 moved to transcribe queue',
  'Task sess-003 retry with denoise profile B',
  'WhisperX batch latency 1.8x realtime',
  'ECAPA-TDNN speaker embeddings refreshed',
  'FastAPI healthcheck: 200 OK',
  'Summary generation completed for sess-006',
  'Storage rotation completed for audio chunks'
];

export default function SystemLogStream() {
  const [lines, setLines] = useState(baseLogs);

  useEffect(() => {
    const id = window.setInterval(() => {
      const line = `[${new Date().toLocaleTimeString()}] ${dynamicEvents[Math.floor(Math.random() * dynamicEvents.length)]}`;
      setLines((current) => [...current.slice(-80), line]);
    }, 1200);

    return () => window.clearInterval(id);
  }, []);

  const text = useMemo(() => lines.join('\n'), [lines]);

  return (
    <div className="card-surface" style={{ padding: '1rem' }}>
      <h3 className="mono" style={{ marginTop: 0 }}>Logs del sistema</h3>
      <pre
        style={{
          margin: 0,
          maxHeight: '280px',
          overflow: 'auto',
          background: 'rgba(8,12,24,.75)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-sm)',
          padding: '0.8rem',
          color: '#9ae6ff',
          fontSize: '0.8rem',
          lineHeight: 1.45,
          fontFamily: 'IBM Plex Mono, monospace'
        }}
      >
        {text}
      </pre>
    </div>
  );
}
