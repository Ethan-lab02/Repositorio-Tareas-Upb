import { useState, useEffect, useCallback } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { es } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { getTareas } from '../../api/tareas';
import { getPeriodos } from '../../api/periodos';
import Modal from '../../components/Modal';
import { Calendar as CalendarIcon, BookOpen, CheckCircle } from 'lucide-react';

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales: { es },
});

const SUBJECT_COLORS = ['#6366f1','#8b5cf6','#ec4899','#f59e0b','#10b981','#3b82f6','#ef4444','#14b8a6','#f97316','#84cc16'];
const messages = {
  today: 'Hoy', previous: 'Anterior', next: 'Siguiente', month: 'Mes',
  week: 'Semana', day: 'Día', agenda: 'Agenda', date: 'Fecha',
  time: 'Hora', event: 'Tarea', noEventsInRange: 'Sin tareas en este rango',
};

const CalendarioPage = () => {
  const [tareas, setTareas] = useState([]);
  const [periodos, setPeriodos] = useState([]);
  const [selectedPeriodo, setSelectedPeriodo] = useState('');
  const [selectedTarea, setSelectedTarea] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [t, p] = await Promise.all([getTareas(), getPeriodos()]);
      setTareas(t.data);
      setPeriodos(p.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const getColor = (id) => SUBJECT_COLORS[(id - 1) % SUBJECT_COLORS.length];

  const filteredTareas = selectedPeriodo
    ? tareas.filter((t) => {
        const p = periodos.find((per) => String(per.id_periodo) === String(selectedPeriodo));
        return p && new Date(t.fecha_entrega) >= new Date(p.fecha_inicio) && new Date(t.fecha_entrega) <= new Date(p.fecha_fin);
      })
    : tareas;

  const events = filteredTareas.map((t) => ({
    id: t.id_tarea,
    title: t.titulo,
    start: new Date(t.fecha_entrega + 'T12:00:00'),
    end: new Date(t.fecha_entrega + 'T13:00:00'),
    resource: t,
    color: getColor(t.id_materia),
  }));

  const eventStyleGetter = useCallback((event) => ({
    style: {
      backgroundColor: event.color,
      borderRadius: '6px',
      border: 'none',
      color: '#fff',
      padding: '2px 6px',
      fontSize: '12px',
      opacity: event.resource.completada ? 0.55 : 1,
      textDecoration: event.resource.completada ? 'line-through' : 'none',
    },
  }), []);

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('es-MX', { day: '2-digit', month: 'long', year: 'numeric' }) : '';

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title"><CalendarIcon size={24} /> Calendario de Tareas</h1>
          <p className="page-subtitle">Vista mensual de todas tus tareas</p>
        </div>
      </div>

      <div className="filter-bar">
        <select
          className="select-periodo"
          value={selectedPeriodo}
          onChange={(e) => setSelectedPeriodo(e.target.value)}
          id="select-periodo-calendario"
        >
          <option value="">Todos los periodos</option>
          {periodos.map((p) => (
            <option key={p.id_periodo} value={p.id_periodo}>{p.nombre}</option>
          ))}
        </select>
        <div className="legend">
          <span className="legend-item"><span className="dot" style={{ background: '#6366f1' }} /> Pendiente</span>
          <span className="legend-item"><span className="dot" style={{ background: '#6366f1', opacity: 0.5 }} /> Completada</span>
        </div>
      </div>

      {loading ? (
        <div className="loading-state">Cargando calendario...</div>
      ) : (
        <div className="calendar-wrapper">
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 600 }}
            eventPropGetter={eventStyleGetter}
            onSelectEvent={(event) => setSelectedTarea(event.resource)}
            messages={messages}
            culture="es"
            views={['month', 'week', 'agenda']}
          />
        </div>
      )}

      <Modal isOpen={!!selectedTarea} onClose={() => setSelectedTarea(null)} title="Detalle de Tarea">
        {selectedTarea && (
          <div className="tarea-detail">
            <h2 style={{ color: getColor(selectedTarea.id_materia) }}>{selectedTarea.titulo}</h2>
            <div className="detail-row">
              <BookOpen size={16} />
              <span><strong>Materia:</strong> {selectedTarea.materia}</span>
            </div>
            <div className="detail-row">
              <CalendarIcon size={16} />
              <span><strong>Entrega:</strong> {formatDate(selectedTarea.fecha_entrega)}</span>
            </div>
            <div className="detail-row">
              <CheckCircle size={16} />
              <span><strong>Estado:</strong> {selectedTarea.completada ? '✓ Completada' : '⏳ Pendiente'}</span>
            </div>
            {selectedTarea.descripcion && (
              <div className="detail-descripcion">
                <strong>Descripción:</strong>
                <p>{selectedTarea.descripcion}</p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default CalendarioPage;
