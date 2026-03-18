import { useState, useEffect } from 'react';
import { getPeriodos, createPeriodo, updatePeriodo, deletePeriodo } from '../../api/periodos';
import Modal from '../../components/Modal';
import { Plus, Edit2, Trash2, Layers, Calendar } from 'lucide-react';

const EMPTY = { nombre: '', fecha_inicio: '', fecha_fin: '' };

const PeriodosPage = () => {
  const [periodos, setPeriodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState('');

  const fetchPeriodos = async () => {
    try {
      const res = await getPeriodos();
      setPeriodos(res.data);
    } catch (e) {
      setError('Error al cargar periodos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPeriodos(); }, []);

  const openCreate = () => { setEditing(null); setForm(EMPTY); setModalOpen(true); };
  const openEdit = (p) => {
    setEditing(p);
    setForm({
      nombre: p.nombre,
      fecha_inicio: p.fecha_inicio?.substring(0, 10),
      fecha_fin: p.fecha_fin?.substring(0, 10),
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await updatePeriodo(editing.id_periodo, form);
      } else {
        await createPeriodo(form);
      }
      fetchPeriodos();
      setModalOpen(false);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al guardar');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este periodo? Se eliminarán las materias y tareas asociadas.')) return;
    try {
      await deletePeriodo(id);
      fetchPeriodos();
    } catch (err) {
      setError(err.response?.data?.error || 'Error al eliminar');
    }
  };

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' }) : '';

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title"><Layers size={24} /> Periodos Escolares</h1>
          <p className="page-subtitle">Gestiona tus ciclos académicos</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate} id="btn-nuevo-periodo">
          <Plus size={16} /> Nuevo Periodo
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <div className="loading-state">Cargando periodos...</div>
      ) : periodos.length === 0 ? (
        <div className="empty-state">
          <Layers size={48} />
          <h3>Sin periodos</h3>
          <p>Crea tu primer periodo escolar para comenzar</p>
          <button className="btn btn-primary" onClick={openCreate}>Crear Periodo</button>
        </div>
      ) : (
        <div className="cards-grid">
          {periodos.map((p) => (
            <div key={p.id_periodo} className="card periodo-card">
              <div className="card-accent" />
              <div className="card-body">
                <h3 className="card-title">{p.nombre}</h3>
                <div className="card-meta">
                  <Calendar size={14} />
                  <span>{formatDate(p.fecha_inicio)} — {formatDate(p.fecha_fin)}</span>
                </div>
              </div>
              <div className="card-actions">
                <button className="btn btn-ghost btn-sm" onClick={() => openEdit(p)} title="Editar">
                  <Edit2 size={15} />
                </button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p.id_periodo)} title="Eliminar">
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Editar Periodo' : 'Nuevo Periodo'}>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Nombre del periodo *</label>
            <input type="text" placeholder="Ej: Semestre Enero-Junio 2025" value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })} required />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Fecha inicio *</label>
              <input type="date" value={form.fecha_inicio}
                onChange={(e) => setForm({ ...form, fecha_inicio: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Fecha fin *</label>
              <input type="date" value={form.fecha_fin}
                onChange={(e) => setForm({ ...form, fecha_fin: e.target.value })} required />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={() => setModalOpen(false)}>Cancelar</button>
            <button type="submit" className="btn btn-primary">{editing ? 'Guardar cambios' : 'Crear Periodo'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default PeriodosPage;
