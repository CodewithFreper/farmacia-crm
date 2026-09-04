// src/models/init-db.js

export function initDatabase(db) {
  // Activar claves foráneas en SQLite (buena práctica)
  db.pragma('foreign_keys = ON');

  // 1. Tabla de usuarios
  db.exec(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL UNIQUE
    )
  `);

  // 2. Tabla de mensajes (Foro)
  db.exec(`
    CREATE TABLE IF NOT EXISTS mensajes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      titulo TEXT NOT NULL,
      contenido TEXT NOT NULL,
      autor_id INTEGER,
      fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (autor_id) REFERENCES usuarios(id)
    )
  `);

  // 3. Tabla de respuestas (Hilos del foro)
  db.exec(`
    CREATE TABLE IF NOT EXISTS respuestas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      mensaje_id INTEGER,
      contenido TEXT NOT NULL,
      autor_id INTEGER,
      fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (mensaje_id) REFERENCES mensajes(id),
      FOREIGN KEY (autor_id) REFERENCES usuarios(id)
    )
  `);

  // 4. Tabla de tareas
  db.exec(`
    CREATE TABLE IF NOT EXISTS tareas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      descripcion TEXT NOT NULL,
      creador_id INTEGER,
      fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
      completada INTEGER DEFAULT 0,
      completado_por_id INTEGER,
      fecha_completado DATETIME,
      FOREIGN KEY (creador_id) REFERENCES usuarios(id),
      FOREIGN KEY (completado_por_id) REFERENCES usuarios(id)
    )
  `);

  // 5. Tabla de eventos (Calendario)
  db.exec(`
    CREATE TABLE IF NOT EXISTS eventos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tipo TEXT NOT NULL,
      titulo TEXT NOT NULL,
      descripcion TEXT,
      fecha_inicio DATE NOT NULL,
      fecha_fin DATE,
      usuario_id INTEGER,
      FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    )
  `);

  // 6. Tabla de turnos (Vista semanal)
  db.exec(`
    CREATE TABLE IF NOT EXISTS turnos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      usuario_id INTEGER NOT NULL,
      fecha DATE NOT NULL,
      tipo_turno TEXT NOT NULL,
      FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    )
  `);

  console.log("✅ Base de datos inicializada correctamente.");
}