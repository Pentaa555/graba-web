import React, { useMemo, useState } from 'react';
import users from '../../data/users.json';
import { login } from '../../stores/auth';
import type { Role, User } from '../../stores/auth';
import { LogIn } from 'lucide-react';

const rolePaths: Record<Role, string> = {
  student: '/student',
  teacher: '/teacher',
  admin: '/admin'
};

const roleQuickAccess: Record<Role, string> = {
  student: 'lgomez@udistrital.edu.co',
  teacher: 'cmendoza@udistrital.edu.co',
  admin: 'admin@udistrital.edu.co'
};

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>('student');
  const [error, setError] = useState('');

  const roleUsers = useMemo(() => users.filter((u) => u.role === role), [role]);

  function quickLogin(targetRole: Role) {
    const user = users.find((u) => u.email === roleQuickAccess[targetRole] && u.role === targetRole);
    if (!user) return;
    setEmail(user.email);
    setPassword('1234');
    setRole(targetRole);
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const found = users.find((u) => u.email === email && u.password === password && u.role === role);

    if (!found) {
      setError('Credenciales invalidas para el rol seleccionado.');
      return;
    }

    login(found as User);
    window.location.href = rolePaths[found.role as Role];
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
        <div style={{
          width: '44px',
          height: '44px',
          borderRadius: '12px',
          background: 'rgba(0,212,255,0.15)',
          border: '1px solid var(--border-active)',
          display: 'grid',
          placeItems: 'center'
        }}>
          <LogIn size={20} color="var(--accent-cyan)" />
        </div>
        <div>
          <h1 className="mono" style={{ margin: 0 }}>SmartLecture UD</h1>
          <p style={{ margin: '0.2rem 0 0', color: 'var(--text-secondary)' }}>Ingreso a plataforma de grabacion inteligente</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '0.5rem', marginBottom: '1rem' }}>
        <button className="interactive" type="button" onClick={() => quickLogin('student')} style={quickBtn}>Entrar como Estudiante</button>
        <button className="interactive" type="button" onClick={() => quickLogin('teacher')} style={quickBtn}>Entrar como Docente</button>
        <button className="interactive" type="button" onClick={() => quickLogin('admin')} style={quickBtn}>Entrar como Admin</button>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '0.8rem' }}>
        <label style={labelStyle}>
          Rol
          <select value={role} onChange={(e) => setRole(e.target.value as Role)} style={inputStyle}>
            <option value="student">Estudiante</option>
            <option value="teacher">Docente</option>
            <option value="admin">Administrador</option>
          </select>
        </label>

        <label style={labelStyle}>
          Email
          <input value={email} onChange={(e) => setEmail(e.target.value)} list="demo-role-users" placeholder="correo institucional" style={inputStyle} />
          <datalist id="demo-role-users">
            {roleUsers.map((u) => (<option key={u.id} value={u.email} />))}
          </datalist>
        </label>

        <label style={labelStyle}>
          Contrasena
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="1234" style={inputStyle} />
        </label>

        {error && <p style={{ margin: 0, color: '#fecaca' }}>{error}</p>}

        <button type="submit" className="interactive" style={submitBtn}>Ingresar</button>
      </form>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: 'grid',
  gap: '0.35rem',
  color: 'var(--text-secondary)',
  fontSize: '0.92rem'
};

const inputStyle: React.CSSProperties = {
  background: 'var(--bg-elevated)',
  border: '1px solid var(--border-subtle)',
  color: 'var(--text-primary)',
  padding: '0.62rem 0.75rem',
  borderRadius: 'var(--radius-sm)'
};

const quickBtn: React.CSSProperties = {
  border: '1px solid var(--border-subtle)',
  background: 'var(--bg-elevated)',
  color: 'var(--text-primary)',
  borderRadius: 'var(--radius-sm)',
  padding: '0.55rem 0.35rem',
  cursor: 'pointer',
  fontSize: '0.8rem'
};

const submitBtn: React.CSSProperties = {
  marginTop: '0.35rem',
  border: 'none',
  borderRadius: 'var(--radius-sm)',
  background: 'var(--accent-cyan)',
  color: '#001018',
  padding: '0.72rem 0.9rem',
  cursor: 'pointer',
  fontWeight: 700
};
