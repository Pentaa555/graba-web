import React, { useMemo, useState } from 'react';
import initialCourses from '../../data/courses.json';
import sessions from '../../data/sessions.json';

type Course = {
  id: string;
  name: string;
  code: string;
  teacherName: string;
  studentIds: string[];
};

export default function CourseManager() {
  const [courses, setCourses] = useState<Course[]>(initialCourses as Course[]);
  const [editing, setEditing] = useState<Course | null>(null);
  const [form, setForm] = useState({ code: '', name: '', teacherName: '' });

  const sessionCounts = useMemo(() => {
    return sessions.reduce((acc, session) => {
      acc[session.courseId] = (acc[session.courseId] ?? 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }, []);

  function resetForm() {
    setEditing(null);
    setForm({ code: '', name: '', teacherName: '' });
  }

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!form.code || !form.name) return;

    if (editing) {
      setCourses((current) => current.map((course) =>
        course.id === editing.id
          ? { ...course, code: form.code, name: form.name, teacherName: form.teacherName }
          : course
      ));
    } else {
      setCourses((current) => [
        ...current,
        {
          id: `course-${Math.random().toString(36).slice(2, 8)}`,
          code: form.code,
          name: form.name,
          teacherName: form.teacherName || 'Por asignar',
          studentIds: []
        }
      ]);
    }
    resetForm();
  }

  return (
    <section style={{ display: 'grid', gap: '1rem' }}>
      <form onSubmit={submit} className="card-surface" style={{ padding: '1rem', display: 'grid', gap: '0.6rem' }}>
        <h3 className="mono" style={{ margin: 0 }}>{editing ? 'Editar curso' : 'Nuevo curso'}</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: '0.5rem' }}>
          <input placeholder="Codigo" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} style={inputStyle} />
          <input placeholder="Nombre" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={inputStyle} />
          <input placeholder="Docente" value={form.teacherName} onChange={(e) => setForm({ ...form, teacherName: e.target.value })} style={inputStyle} />
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="interactive" type="submit" style={btnStyle}>{editing ? 'Guardar' : 'Crear'}</button>
          {editing && <button className="interactive" type="button" onClick={resetForm} style={ghostBtn}>Cancelar</button>}
        </div>
      </form>

      <div className="card-surface" style={{ padding: '1rem', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left', color: 'var(--text-secondary)' }}>
              <th>Codigo</th>
              <th>Nombre</th>
              <th>Docente</th>
              <th>Estudiantes</th>
              <th>Sesiones</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course.id} style={{ borderTop: '1px solid var(--border-subtle)' }}>
                <td>{course.code}</td>
                <td>{course.name}</td>
                <td>{course.teacherName}</td>
                <td>{course.studentIds.length}</td>
                <td>{sessionCounts[course.id] ?? 0}</td>
                <td style={{ display: 'flex', gap: '0.45rem', padding: '0.5rem 0' }}>
                  <button className="interactive" style={ghostBtn} onClick={() => {
                    setEditing(course);
                    setForm({ code: course.code, name: course.name, teacherName: course.teacherName });
                  }}>Editar</button>
                  <button className="interactive" style={dangerBtn} onClick={() => setCourses((current) => current.filter((item) => item.id !== course.id))}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

const inputStyle: React.CSSProperties = {
  background: 'var(--bg-elevated)',
  border: '1px solid var(--border-subtle)',
  color: 'var(--text-primary)',
  borderRadius: 'var(--radius-sm)',
  padding: '0.5rem 0.65rem'
};

const btnStyle: React.CSSProperties = {
  border: 'none',
  background: 'var(--accent-cyan)',
  color: '#001018',
  padding: '0.5rem 0.7rem',
  borderRadius: 'var(--radius-sm)',
  fontWeight: 700,
  cursor: 'pointer'
};

const ghostBtn: React.CSSProperties = {
  border: '1px solid var(--border-subtle)',
  background: 'var(--bg-elevated)',
  color: 'var(--text-primary)',
  padding: '0.5rem 0.7rem',
  borderRadius: 'var(--radius-sm)',
  cursor: 'pointer'
};

const dangerBtn: React.CSSProperties = {
  ...ghostBtn,
  borderColor: 'rgba(239,68,68,.35)',
  color: '#fecaca'
};
