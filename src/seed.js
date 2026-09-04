// src/seed.js
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import Database from 'better-sqlite3';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Conectar a la misma base de datos
const db = new Database(join(__dirname, '..', 'database', 'farmacia.db'));

console.log("🌱 Iniciando siembra de datos de prueba...");

// 1. Limpiar datos anteriores (para evitar duplicados si lo ejecutas varias veces)
db.exec('DELETE FROM turnos');
db.exec('DELETE FROM eventos');
db.exec('DELETE FROM tareas');
db.exec('DELETE FROM respuestas');
db.exec('DELETE FROM mensajes');
db.exec('DELETE FROM usuarios');

// 2. Insertar usuarios
const stmtUsuario = db.prepare('INSERT INTO usuarios (nombre) VALUES (?)');
stmtUsuario.run('María');
stmtUsuario.run('Juan');
stmtUsuario.run('Ana');
stmtUsuario.run('Carlos');
console.log("✅ Usuarios creados.");

// Obtener los IDs de los usuarios para usarlos como referencia
const users = db.prepare('SELECT * FROM usuarios').all();
const maria = users.find(u => u.nombre === 'María').id;
const juan = users.find(u => u.nombre === 'Juan').id;
const ana = users.find(u => u.nombre === 'Ana').id;
const carlos = users.find(u => u.nombre === 'Carlos').id;

// 3. Insertar tareas de ejemplo
const stmtTarea = db.prepare(`
  INSERT INTO tareas (descripcion, creador_id, completada, completado_por_id, fecha_completado) 
  VALUES (?, ?, ?, ?, ?)
`);
stmtTarea.run('Revisar inventario de estantería 2', ana, 0, null, null); // Pendiente
stmtTarea.run('Pedir más mascarillas FFP2', carlos, 0, null, null); // Pendiente
stmtTarea.run('Limpiar mostrador principal', juan, 1, maria, new Date().toISOString()); // Completada
console.log("✅ Tareas creadas.");

// 4. Insertar mensajes de ejemplo
const stmtMensaje = db.prepare('INSERT INTO mensajes (titulo, contenido, autor_id) VALUES (?, ?, ?)');
const msg1 = stmtMensaje.run('Reunión de equipo mañana', 'Recordad que mañana a las 9:00 tenemos la reunión mensual.', maria).lastInsertRowid;
const msg2 = stmtMensaje.run('Falta paracetamol', 'Se ha agotado el paracetamol de 1g en la estantería 3.', juan).lastInsertRowid;
console.log("✅ Mensajes creados.");

// 5. Insertar respuestas de ejemplo
const stmtRespuesta = db.prepare('INSERT INTO respuestas (mensaje_id, contenido, autor_id) VALUES (?, ?, ?)');
stmtRespuesta.run(msg1, 'Confirmado, allí estaré.', ana);
stmtRespuesta.run(msg2, 'Ya he hecho el pedido al almacén, llega mañana.', carlos);
console.log("✅ Respuestas creadas.");

// 6. Insertar turnos de ejemplo (para la vista semanal)
// Usamos fechas relativas a hoy para que siempre se vean en la semana actual
const hoy = new Date();
const formatDate = (daysToAdd) => {
  const d = new Date(hoy);
  d.setDate(d.getDate() + daysToAdd);
  return d.toISOString().split('T')[0]; // Formato YYYY-MM-DD
};

const stmtTurno = db.prepare('INSERT INTO turnos (usuario_id, fecha, tipo_turno) VALUES (?, ?, ?)');

// María: Mañana (Lunes, Miércoles, Viernes)
stmtTurno.run(maria, formatDate(0), 'mañana');
stmtTurno.run(maria, formatDate(2), 'mañana');
stmtTurno.run(maria, formatDate(4), 'mañana');

// Juan: Tarde (Martes, Jueves)
stmtTurno.run(juan, formatDate(1), 'tarde');
stmtTurno.run(juan, formatDate(3), 'tarde');

// Ana: Partido (Lunes, Miércoles)
stmtTurno.run(ana, formatDate(0), 'partido');
stmtTurno.run(ana, formatDate(2), 'partido');

// Carlos: Mañana (Martes, Jueves, Sábado)
stmtTurno.run(carlos, formatDate(1), 'mañana');
stmtTurno.run(carlos, formatDate(3), 'mañana');
stmtTurno.run(carlos, formatDate(5), 'mañana');

console.log("✅ Turnos creados.");

console.log("🎉 ¡Base de datos poblada con éxito! Ya puedes usar la app.");