import { useState, useEffect } from 'react';
import { getHorarios } from '../../api/horarios';
import { getPeriodos } from '../../api/periodos';
import { LayoutDashboard } from 'lucide-react';

const DIAS = ['Lun', 'Mar', 'Mie', 'Jue', 'Vie'];
const SUBJECT_COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444', '#14b8a6', '#f97316', '#84cc16'];
const HORAS = Array.from({ length: 7 }, (_, i) => i + 7); // 7:00 a 13:00 (muestra el bloque hasta las 14:00)

const timeToMinutes = (t) => {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
};

const HorarioSemanalPage = () => {
  const [horarios, setHorarios] = useState([]);
  const [periodos, setPeriodos] = useState([]);
  const [selectedPeriodo, setSelectedPeriodo] = useState('');
  const [loading, setLoading] = useState(true);
  const [tooltip, setTooltip] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [h, p] = await Promise.all([getHorarios(), getPeriodos()]);
      setHorarios(h.data);
      setPeriodos(p.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const getColor = (id) => SUBJECT_COLORS[(id - 1) % SUBJECT_COLORS.length];

  // Filtrar horarios por periodo si se seleccionó uno
  const filteredHorarios = selectedPeriodo
    ? horarios.filter((h) => String(h.id_periodo) === String(selectedPeriodo) ||
      periodos.find(p => String(p.id_periodo) === String(selectedPeriodo))?.nombre === h.periodo)
    : horarios;


  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title"><LayoutDashboard size={24} /> Horario Semanal</h1>
          <p className="page-subtitle">Vista de tu semana escolar</p>
        </div>
      </div>

      <div className="filter-bar">
        <select
          className="select-periodo"
          value={selectedPeriodo}
          onChange={(e) => setSelectedPeriodo(e.target.value)}
          id="select-periodo-horario"
        >
          <option value="">Todos los periodos</option>
          {periodos.map((p) => (
            <option key={p.id_periodo} value={p.id_periodo}>{p.nombre}</option>
          ))}
        </select>
        <div className="legend">
          {[...new Set(filteredHorarios.map(h => h.id_materia))].map((id) => {
            const h = filteredHorarios.find(x => x.id_materia === id);
            return (
              <span key={id} className="legend-item">
                <span className="dot" style={{ background: getColor(id) }} />
                {h?.materia}
              </span>
            );
          })}
        </div>
      </div>

      {loading ? (
        <div className="loading-state">Cargando horario...</div>
      ) : filteredHorarios.length === 0 ? (
        <div className="empty-state">
          <LayoutDashboard size={48} />
          <h3>Sin horario</h3>
          <p>Agrega horarios desde la sección Horarios</p>
        </div>
      ) : (
        <div className="schedule-container">
          <div className="schedule-grid">
            {/* Header de días */}
            <div className="schedule-time-header" />
            {DIAS.map((dia) => (
              <div key={dia} className="schedule-day-header">{dia}</div>
            ))}

            {/* Filas de horas */}
            {HORAS.map((hora) => (
              <>
                <div key={`time-${hora}`} className="schedule-time-label">
                  {`${hora}:00`}
                </div>
                {DIAS.map((dia) => {
                  const entriesThisHour = filteredHorarios.filter((h) => {
                    if (h.dia_semana !== dia) return false;
                    const s = timeToMinutes(h.hora_inicio);
                    return Math.floor(s / 60) === hora;
                  });
                  return (
                    <div key={`${dia}-${hora}`} className="schedule-cell">
                      {entriesThisHour.map((h, idx) => {
                        const color = getColor(h.id_materia);
                        const startMin = timeToMinutes(h.hora_inicio);
                        const endMin = timeToMinutes(h.hora_fin);
                        const cellStart = hora * 60;

                        // Posicionamiento absoluto relativo a la celda de inicio
                        const top = ((startMin - cellStart) / 60) * 100;
                        const height = ((endMin - startMin) / 60) * 100;
                        const width = 100 / entriesThisHour.length;

                        return (
                          <div
                            key={h.id_horario}
                            className="schedule-block"
                            style={{
                              position: 'absolute',
                              top: `${top}%`,
                              height: `${height}%`,
                              width: `${width - 2}%`, // Un pequeño margen entre bloques paralelos
                              left: `${idx * width + 1}%`,
                              background: `linear-gradient(135deg, ${color}dd, ${color}99)`,
                              zIndex: 10,
                            }}
                            onMouseEnter={(e) => setTooltip({ h, x: e.clientX, y: e.clientY })}
                            onMouseLeave={() => setTooltip(null)}
                          >
                            <span className="block-materia">{h.materia}</span>
                            <span className="block-time">
                              {h.hora_inicio?.substring(0, 5)} – {h.hora_fin?.substring(0, 5)}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </>
            ))}
          </div>

          {tooltip && (
            <div
              className="schedule-tooltip"
              style={{ left: tooltip.x + 12, top: tooltip.y - 60, position: 'fixed' }}
            >
              <strong>{tooltip.h.materia}</strong>
              <span>{tooltip.h.dia_semana} {tooltip.h.hora_inicio?.substring(0, 5)}–{tooltip.h.hora_fin?.substring(0, 5)}</span>
              {tooltip.h.periodo && <span>Periodo: {tooltip.h.periodo}</span>}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HorarioSemanalPage;
