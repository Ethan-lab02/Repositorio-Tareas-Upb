const pool = require('../config/db');

async function migrate() {
  const client = await pool.connect();
  try {
    console.log('Iniciando migración de la tabla horarios...');
    
    // 1. Eliminar la restricción actual
    await client.query('ALTER TABLE horarios DROP CONSTRAINT IF EXISTS chk_dia_semana');
    
    // 2. Cambiar el tipo de columna a VARCHAR(15) (más flexible que CHAR(3))
    await client.query('ALTER TABLE horarios ALTER COLUMN dia_semana TYPE VARCHAR(15)');
    
    // 3. (Opcional) Si hay datos abreviados, podríamos mapearlos, pero el error ocurre al CREAR.
    // Si ya hay datos como 'Lun', podemos dejarlos o cambiarlos.
    
    // 4. Agregar la nueva restricción con los días completos
    await client.query(`
      ALTER TABLE horarios ADD CONSTRAINT chk_dia_semana 
      CHECK (dia_semana IN ('Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'))
    `);
    
    console.log('Migración completada exitosamente.');
  } catch (err) {
    console.error('Error durante la migración:', err);
  } finally {
    client.release();
    process.exit();
  }
}

migrate();
