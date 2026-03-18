import { useState, useEffect } from 'react';
import { getHorarios, createHorario, updateHorario, deleteHorario } from '../../api/horarios';
import { getMaterias } from '../../api/materias';
import Modal from '../../components/Modal';
import { Plus, Edit2, Trash2, Clock } from 'lucide-react';

const DIAS = ['Lun', 'Mar', 'Mie', 'Jue', 'Vie'];
const SUBJECT_COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444', '#14b8a6', '#f97316', '#84cc16'];
const EMPTY = { dia_semana: 'Lun', hora_inicio: '', hora_fin: '', id_materia: '' };

const HorariosPage = () => {
  const [horarios, setHorarios] = useState([]);
  const [materias, setMaterias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState('');

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [h, m] = await Promise.all([getHorarios(), getMaterias()]);
      setHorarios(h.data);
      setMaterias(m.data);
    } catch (e) {
      setError('Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const getColor = (id) => SUBJECT_COLORS[(id - 1) % SUBJECT_COLORS.length];

  const openCreate = () => { setEditing(null); setForm(EMPTY); setModalOpen(true); };
  const openEdit = (h) => {
    setEditing(h);
    setForm({
      dia_semana: h.dia_semana,
      hora_inicio: h.hora_inicio?.substring(0, 5),
      hora_fin: h.hora_fin?.substring(0, 5),
      id_materia: h.id_materia,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await updateHorario(editing.id_horario, { dia_semana: form.dia_semana, hora_inicio: form.hora_inicio, hora_fin: form.hora_fin });
      } else {
        await createHorario(form);
      }
      fetchAll();
      setModalOpen(false);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al guardar');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este horario?')) return;
    try {
      await deleteHorario(id);
      fetchAll();
    } catch (err) {
      setError(err.response?.data?.error || 'Error al eliminar');
    }
  };

  const grouped = DIAS.reduce((acc, dia) => {
    acc[dia] = horarios.filter((h) => h.dia_semana === dia);
    return acc;
  }, {});

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title"><Clock size={24} /> Horarios</h1>
          <p className="page-subtitle">Configura los horarios de tus clases</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate} id="btn-nuevo-horario">
          <Plus size={16} /> Nuevo Horario
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <div className="loading-state">Cargando horarios...</div>
      ) : horarios.length === 0 ? (
        <div className="empty-state">
          <Clock size={48} />
          <h3>Sin horarios</h3>
          <p>Agrega los horarios de tus clases</p>
          <button className="btn btn-primary" onClick={openCreate}>Agregar Horario</button>
        </div>
      ) : (
        <div className="horarios-grid">
          {DIAS.map((dia) => grouped[dia].length > 0 && (
            <div key={dia} className="dia-group">
              <h3 className="dia-title">{dia}</h3>
              <div className="horarios-list">
                {grouped[dia]
                  .sort((a, b) => a.hora_inicio.localeCompare(b.hora_inicio))
                  .map((h) => {
                    const color = getColor(h.id_materia);
                    return (
                      <div key={h.id_horario} className="horario-item" style={{ borderLeft: `4px solid ${color}` }}>
                        <div className="horario-time" style={{ color }}>
                          {h.hora_inicio?.substring(0, 5)} – {h.hora_fin?.substring(0, 5)}
                        </div>
                        <div className="horario-materia">{h.materia}</div>
                        <div className="horario-actions">
                          <button className="btn btn-ghost btn-sm" onClick={() => openEdit(h)}><Edit2 size={13} /></button>
                          <button className="btn btn-danger btn-sm" onClick={() => handleDelete(h.id_horario)}><Trash2 size={13} /></button>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Editar Horario' : 'Nuevo Horario'}>
        <form onSubmit={handleSubmit} className="modal-form">
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
            <label>Día de la semana *</label>
            <select value={form.dia_semana} onChange={(e) => setForm({ ...form, dia_semana: e.target.value })} required>
              {DIAS.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Hora inicio *</label>
              <input type="time" value={form.hora_inicio}
                onChange={(e) => setForm({ ...form, hora_inicio: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Hora fin *</label>
              <input type="time" value={form.hora_fin}
                onChange={(e) => setForm({ ...form, hora_fin: e.target.value })} required />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={() => setModalOpen(false)}>Cancelar</button>
            <button type="submit" className="btn btn-primary">{editing ? 'Guardar cambios' : 'Crear Horario'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default HorariosPage;
