import React, { useMemo, useState } from 'react';
import usersData from '../../data/users.json';
import courses from '../../data/courses.json';
import Modal from '../ui/Modal';

type Role = 'student' | 'teacher' | 'admin';

type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
  courses?: string[];
};

const lastAccessMap: Record<string, string> = {
  'student-001': '2026-04-04 18:21',
  'student-002': '2026-04-04 17:04',
  'student-003': '2026-04-03 20:41',
  'teacher-001': '2026-04-05 07:56',
  'teacher-002': '2026-04-04 21:33',
  'admin-001': '2026-04-05 08:10'
};

export default function UserTable() {
  const [users, setUsers] = useState<User[]>(usersData as User[]);
  const [query, setQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | Role>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [form, setForm] = useState({ name: '', email: '', role: 'student' as Role });

  const courseMap = useMemo(() => Object.fromEntries(courses.map((c) => [c.id, c.code])), []);

  const filtered = useMemo(() => {
    return users.filter((user) => {
      const byRole = roleFilter === 'all' ? true : user.role === roleFilter;
      const byText =
        user.name.toLowerCase().includes(query.toLowerCase()) || user.email.toLowerCase().includes(query.toLowerCase());
      return byRole && byText;
    });
  }, [users, roleFilter, query]);

  function openNew() {
    setEditing(null);
    setForm({ name: '', email: '', role: 'student' });
    setModalOpen(true);
  }

  function openEdit(user: User) {
    setEditing(user);
    setForm({ name: user.name, email: user.email, role: user.role });
    setModalOpen(true);
  }

  function submitForm(event: React.FormEvent) {
    event.preventDefault();
    if (!form.name || !form.email) return;

    if (editing) {
      setUsers((current) => current.map((user) => (user.id === editing.id ? { ...user, ...form } : user)));
    } else {
      setUsers((current) => [
        ...current,
        {
          id: `user-${Math.random().toString(36).slice(2, 8)}`,
          name: form.name,
          email: form.email,
          role: form.role,
          courses: []
        }
      ]);
    }

    setModalOpen(false);
  }

  return (
    <section style={{ display: 'grid', gap: '1rem' }}>
      <div className="card-surface" style={{ padding: '1rem', display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
        <input placeholder="Buscar por nombre o email" value={query} onChange={(e) => setQuery(e.target.value)} style={inputStyle} />
        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value as any)} style={inputStyle}>
          <option value="all">Todos los roles</option>
          <option value="student">Estudiante</option>
          <option value="teacher">Docente</option>
          <option value="admin">Admin</option>
        </select>
        <button className="interactive" onClick={openNew} style={buttonStyle}>Nuevo Usuario</button>
      </div>

      <div className="card-surface" style={{ padding: '1rem', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ textAlign: 'left', color: 'var(--text-secondary)' }}>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Cursos asignados</th>
              <th>Ultimo acceso</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((user) => (
              <tr key={user.id} style={{ borderTop: '1px solid var(--border-subtle)' }}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <span className={`status-badge ${badgeClass(user.role)}`}>{user.role}</span>
                </td>
                <td>{(user.courses ?? []).map((id) => courseMap[id] ?? id).join(', ') || '-'}</td>
                <td>{lastAccessMap[user.id] ?? '2026-04-01 12:00'}</td>
                <td style={{ display: 'flex', gap: '0.4rem', padding: '0.45rem 0' }}>
                  <button className="interactive" style={ghostBtn} onClick={() => openEdit(user)}>Editar</button>
                  <button className="interactive" style={dangerBtn} onClick={() => setUsers((current) => current.filter((u) => u.id !== user.id))}>Desactivar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Editar usuario' : 'Nuevo usuario'}>
        <form onSubmit={submitForm} style={{ display: 'grid', gap: '0.6rem' }}>
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Nombre" style={inputStyle} />
          <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email" style={inputStyle} />
          <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as Role })} style={inputStyle}>
            <option value="student">Estudiante</option>
            <option value="teacher">Docente</option>
            <option value="admin">Admin</option>
          </select>
          <button type="submit" className="interactive" style={buttonStyle}>Guardar</button>
        </form>
      </Modal>
    </section>
  );
}

function badgeClass(role: Role) {
  if (role === 'student') return 'status-processing';
  if (role === 'teacher') return 'status-processed';
  return 'status-pending';
}

const inputStyle: React.CSSProperties = {
  background: 'var(--bg-elevated)',
  border: '1px solid var(--border-subtle)',
  color: 'var(--text-primary)',
  borderRadius: 'var(--radius-sm)',
  padding: '0.5rem 0.6rem'
};

const buttonStyle: React.CSSProperties = {
  border: 'none',
  background: 'var(--accent-cyan)',
  color: '#001018',
  borderRadius: 'var(--radius-sm)',
  padding: '0.5rem 0.75rem',
  fontWeight: 700,
  cursor: 'pointer'
};

const ghostBtn: React.CSSProperties = {
  border: '1px solid var(--border-subtle)',
  background: 'var(--bg-elevated)',
  color: 'var(--text-primary)',
  borderRadius: 'var(--radius-sm)',
  padding: '0.35rem 0.55rem',
  cursor: 'pointer'
};

const dangerBtn: React.CSSProperties = {
  ...ghostBtn,
  borderColor: 'rgba(239,68,68,.35)',
  color: '#fecaca'
};
