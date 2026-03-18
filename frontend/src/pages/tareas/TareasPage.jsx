import { useState, useEffect } from 'react';
import {
  getTareas, getTareasPendientes, getTareasVencidas, getTareasCompletadas,
  createTarea, updateTarea, deleteTarea, completarTarea
} from '../../api/tareas';
import { getMaterias } from '../../api/materias';
import Modal from '../../components/Modal';
import { Plus, Edit2, Trash2, CheckSquare, CheckCircle, Clock, AlertTriangle, Calendar, BookOpen } from 'lucide-react';

const TABS = [
  { key: 'todas', label: 'Todas', icon: CheckSquare },
  { key: 'pendientes', label: 'Pendientes', icon: Clock },
  { key: 'vencidas', label: 'Vencidas', icon: AlertTriangle },
  { key: 'completadas', label: 'Completadas', icon: CheckCircle },
];

const SUBJECT_COLORS = ['#6366f1','#8b5cf6','#ec4899','#f59e0b','#10b981','#3b82f6','#ef4444','#14b8a6','#f97316','#84cc16'];

const EMPTY = { titulo: '', descripcion: '', fecha_entrega: '', id_materia: '' };

const TareasPage = () => {
  const [tareas, setTareas] = useState([]);
  const [materias, setMaterias] = useState([]);
  const [tab, setTab] = useState('todas');
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [detailModal, setDetailModal] = useState(null);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState('');

  const fetchTareas = async () => {
    setLoading(true);
    try {
      const fetchers = {
        todas: getTareas,
        pendientes: getTareasPendientes,
        vencidas: getTareasVencidas,
        completadas: getTareasCompletadas,
      };
      const res = await fetchers[tab]();
      setTareas(res.data);
    } catch (e) {
      setError('Error al cargar tareas');
    } finally {
      setLoading(false);
    }
  };

  const fetchMaterias = async () => {
    const res = await getMaterias();
    setMaterias(res.data);
  };

  useEffect(() => { fetchMaterias(); }, []);
  useEffect(() => { fetchTareas(); }, [tab]);

  const getColorForMateria = (id) => SUBJECT_COLORS[(id - 1) % SUBJECT_COLORS.length];

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' }) : '';

  const isOverdue = (t) => !t.completada && new Date(t.fecha_entrega) < new Date();

  const openCreate = () => { setEditing(null); setForm(EMPTY); setModalOpen(true); };
  const openEdit = (t) => {
    setEditing(t);
    setForm({
      titulo: t.titulo,
      descripcion: t.descripcion || '',
      fecha_entrega: t.fecha_entrega?.substring(0, 10),
      id_materia: t.id_materia,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await updateTarea(editing.id_tarea, { titulo: form.titulo, descripcion: form.descripcion, fecha_entrega: form.fecha_entrega });
      } else {
        await createTarea(form);
      }
      fetchTareas();
      setModalOpen(false);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al guardar');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar esta tarea?')) return;
    try {
      await deleteTarea(id);
      fetchTareas();
    } catch (err) {
      setError(err.response?.data?.error || 'Error al eliminar');
    }
  };

  const handleCompletar = async (id) => {
    try {
      await completarTarea(id);
      fetchTareas();
    } catch (err) {
      setError(err.response?.data?.error || 'Error al completar');
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title"><CheckSquare size={24} /> Tareas</h1>
          <p className="page-subtitle">Seguimiento de tus asignaciones</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate} id="btn-nueva-tarea">
          <Plus size={16} /> Nueva Tarea
        </button>
      </div>

      <div className="tabs">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            className={`tab ${tab === key ? 'active' : ''}`}
            onClick={() => setTab(key)}
            id={`tab-${key}`}
          >
            <Icon size={14} /> {label}
          </button>
        ))}
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <div className="loading-state">Cargando tareas...</div>
      ) : tareas.length === 0 ? (
        <div className="empty-state">
          <CheckSquare size={48} />
          <h3>Sin tareas</h3>
          <p>No hay tareas en esta categoría</p>
          {tab === 'todas' && <button className="btn btn-primary" onClick={openCreate}>Agregar Tarea</button>}
        </div>
      ) : (
        <div className="tareas-list">
          {tareas.map((t) => {
            const color = getColorForMateria(t.id_materia);
            return (
              <div
                key={t.id_tarea}
                className={`tarea-card ${t.completada ? 'tarea-completada' : ''} ${isOverdue(t) ? 'tarea-vencida' : ''}`}
                style={{ '--tarea-color': color }}
              >
                <div className="tarea-color-bar" style={{ background: color }} />
                <div className="tarea-body" onClick={() => setDetailModal(t)} style={{ cursor: 'pointer' }}>
                  <div className="tarea-header-row">
                    <h3 className="tarea-titulo">{t.titulo}</h3>
                    <div className="tarea-badges">
                      {t.completada && <span className="status-badge completada">✓ Completada</span>}
                      {isOverdue(t) && <span className="status-badge vencida">⚠ Vencida</span>}
                    </div>
                  </div>
                  <div className="tarea-meta">
                    <span className="materia-chip" style={{ background: color + '22', color, border: `1px solid ${color}44` }}>
                      <BookOpen size={12} /> {t.materia}
                    </span>
                    <span className="fecha-chip">
                      <Calendar size={12} /> {formatDate(t.fecha_entrega)}
                    </span>
                  </div>
                  {t.descripcion && <p className="tarea-desc">{t.descripcion}</p>}
                </div>
                <div className="card-actions">
                  {!t.completada && (
                    <button className="btn btn-success btn-sm" onClick={() => handleCompletar(t.id_tarea)} title="Marcar completada">
                      <CheckCircle size={15} />
                    </button>
                  )}
                  <button className="btn btn-ghost btn-sm" onClick={() => openEdit(t)} title="Editar">
                    <Edit2 size={15} />
                  </button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(t.id_tarea)} title="Eliminar">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal detalle */}
      <Modal isOpen={!!detailModal} onClose={() => setDetailModal(null)} title="Detalle de Tarea">
        {detailModal && (
          <div className="tarea-detail">
            <h2 style={{ color: getColorForMateria(detailModal.id_materia) }}>{detailModal.titulo}</h2>
            <div className="detail-row">
              <BookOpen size={16} />
              <span><strong>Materia:</strong> {detailModal.materia}</span>
            </div>
            <div className="detail-row">
              <Calendar size={16} />
              <span><strong>Entrega:</strong> {formatDate(detailModal.fecha_entrega)}</span>
            </div>
            <div className="detail-row">
              <CheckCircle size={16} />
              <span><strong>Estado:</strong> {detailModal.completada ? 'Completada ✓' : isOverdue(detailModal) ? 'Vencida ⚠' : 'Pendiente'}</span>
            </div>
            {detailModal.descripcion && (
              <div className="detail-descripcion">
                <strong>Descripción:</strong>
                <p>{detailModal.descripcion}</p>
              </div>
            )}
            {!detailModal.completada && (
              <button className="btn btn-success btn-full" onClick={() => { handleCompletar(detailModal.id_tarea); setDetailModal(null); }}>
                <CheckCircle size={16} /> Marcar como Completada
              </button>
            )}
          </div>
        )}
      </Modal>

      {/* Modal CRUD */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Editar Tarea' : 'Nueva Tarea'}>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Título *</label>
            <input type="text" placeholder="Ej: Examen parcial de Cálculo" value={form.titulo}
              onChange={(e) => setForm({ ...form, titulo: e.target.value })} required />
          </div>
          {!editing && (
            <div className="form-group">
              <label>Materia *</label>
              <select value={form.id_materia} onChange={(e) => setForm({ ...form, id_materia: e.target.value })} required>
                <option value="">Seleccionar materia</option>
                {materias.map((m) => <option key={m.id_materia} value={m.id_materia}>{m.nombre} ({m.periodo || 'Sin periodo'})</option>)}
              </select>
            </div>
          )}
          <div className="form-group">
            <label>Fecha de entrega *</label>
            <input type="date" value={form.fecha_entrega}
              onChange={(e) => setForm({ ...form, fecha_entrega: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Descripción</label>
            <textarea rows={3} placeholder="Detalles de la tarea..." value={form.descripcion}
              onChange={(e) => setForm({ ...form, descripcion: e.target.value })} />
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={() => setModalOpen(false)}>Cancelar</button>
            <button type="submit" className="btn btn-primary">{editing ? 'Guardar cambios' : 'Crear Tarea'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default TareasPage;
