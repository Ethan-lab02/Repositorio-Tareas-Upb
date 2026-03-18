import { useState, useEffect } from 'react';
import { getMaterias, getMateriasByPeriodo, createMateria, updateMateria, deleteMateria } from '../../api/materias';
import { getPeriodos } from '../../api/periodos';
import Modal from '../../components/Modal';
import { Plus, Edit2, Trash2, BookOpen, User } from 'lucide-react';

const SUBJECT_COLORS = [
  '#6366f1','#8b5cf6','#ec4899','#f59e0b','#10b981','#3b82f6','#ef4444','#14b8a6','#f97316','#84cc16'
];

const EMPTY = { nombre: '', profesor: '', id_periodo: '' };

const MateriasPage = () => {
  const [materias, setMaterias] = useState([]);
  const [periodos, setPeriodos] = useState([]);
  const [selectedPeriodo, setSelectedPeriodo] = useState('');
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState('');

  const fetchPeriodos = async () => {
    const res = await getPeriodos();
    setPeriodos(res.data);
    if (res.data.length > 0 && !selectedPeriodo) {
      setSelectedPeriodo(res.data[0].id_periodo);
    }
  };

  const fetchMaterias = async () => {
    setLoading(true);
    try {
      const res = selectedPeriodo
        ? await getMateriasByPeriodo(selectedPeriodo)
        : await getMaterias();
      setMaterias(res.data);
    } catch (e) {
      setError('Error al cargar materias');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPeriodos(); }, []);
  useEffect(() => { if (periodos.length > 0) fetchMaterias(); }, [selectedPeriodo, periodos]);

  const getColor = (id) => SUBJECT_COLORS[(id - 1) % SUBJECT_COLORS.length];

  const openCreate = () => {
    setEditing(null);
    setForm({ ...EMPTY, id_periodo: selectedPeriodo });
    setModalOpen(true);
  };

  const openEdit = (m) => {
    setEditing(m);
    setForm({ nombre: m.nombre, profesor: m.profesor || '', id_periodo: m.id_periodo });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await updateMateria(editing.id_materia, { nombre: form.nombre, profesor: form.profesor });
      } else {
        await createMateria(form);
      }
      fetchMaterias();
      setModalOpen(false);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al guardar');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar esta materia? Se eliminarán sus tareas y horarios.')) return;
    try {
      await deleteMateria(id);
      fetchMaterias();
    } catch (err) {
      setError(err.response?.data?.error || 'Error al eliminar');
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title"><BookOpen size={24} /> Materias</h1>
          <p className="page-subtitle">Asignaturas del periodo seleccionado</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate} id="btn-nueva-materia">
          <Plus size={16} /> Nueva Materia
        </button>
      </div>

      <div className="filter-bar">
        <select
          className="select-periodo"
          value={selectedPeriodo}
          onChange={(e) => setSelectedPeriodo(e.target.value)}
          id="select-periodo-materias"
        >
          <option value="">Todos los periodos</option>
          {periodos.map((p) => (
            <option key={p.id_periodo} value={p.id_periodo}>{p.nombre}</option>
          ))}
        </select>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <div className="loading-state">Cargando materias...</div>
      ) : materias.length === 0 ? (
        <div className="empty-state">
          <BookOpen size={48} />
          <h3>Sin materias</h3>
          <p>Agrega materias al periodo seleccionado</p>
          <button className="btn btn-primary" onClick={openCreate}>Agregar Materia</button>
        </div>
      ) : (
        <div className="cards-grid">
          {materias.map((m) => (
            <div key={m.id_materia} className="card materia-card" style={{ '--accent-color': getColor(m.id_materia) }}>
              <div className="card-accent" style={{ background: getColor(m.id_materia) }} />
              <div className="card-body">
                <div className="materia-badge" style={{ background: getColor(m.id_materia) + '22', color: getColor(m.id_materia), border: `1px solid ${getColor(m.id_materia)}44` }}>
                  {m.nombre.charAt(0)}
                </div>
                <h3 className="card-title">{m.nombre}</h3>
                {m.profesor && (
                  <div className="card-meta">
                    <User size={14} />
                    <span>{m.profesor}</span>
                  </div>
                )}
                {m.periodo && <span className="badge">{m.periodo}</span>}
              </div>
              <div className="card-actions">
                <button className="btn btn-ghost btn-sm" onClick={() => openEdit(m)} title="Editar">
                  <Edit2 size={15} />
                </button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(m.id_materia)} title="Eliminar">
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Editar Materia' : 'Nueva Materia'}>
        <form onSubmit={handleSubmit} className="modal-form">
          {!editing && (
            <div className="form-group">
              <label>Periodo *</label>
              <select value={form.id_periodo} onChange={(e) => setForm({ ...form, id_periodo: e.target.value })} required>
                <option value="">Seleccionar periodo</option>
                {periodos.map((p) => <option key={p.id_periodo} value={p.id_periodo}>{p.nombre}</option>)}
              </select>
            </div>
          )}
          <div className="form-group">
            <label>Nombre de la materia *</label>
            <input type="text" placeholder="Ej: Cálculo Diferencial" value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Profesor</label>
            <input type="text" placeholder="Nombre del profesor" value={form.profesor}
              onChange={(e) => setForm({ ...form, profesor: e.target.value })} />
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={() => setModalOpen(false)}>Cancelar</button>
            <button type="submit" className="btn btn-primary">{editing ? 'Guardar cambios' : 'Crear Materia'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default MateriasPage;
