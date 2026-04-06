import React from 'react';

type ModalProps = {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
};

export default function Modal({ open, title, onClose, children }: ModalProps) {
  if (!open) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.65)',
        display: 'grid',
        placeItems: 'center',
        zIndex: 100
      }}
    >
      <div className="card-surface" style={{ width: 'min(680px, 92vw)', padding: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
          <h3 className="mono" style={{ margin: 0 }}>{title}</h3>
          <button className="interactive" onClick={onClose} style={{
            border: '1px solid var(--border-subtle)',
            background: 'transparent',
            color: 'var(--text-primary)',
            borderRadius: 'var(--radius-sm)',
            padding: '0.35rem 0.6rem',
            cursor: 'pointer'
          }}>
            Cerrar
          </button>
        </div>
        <div style={{ marginTop: '1rem' }}>{children}</div>
      </div>
    </div>
  );
}
