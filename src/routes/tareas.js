// src/routes/tareas.js
import { Router } from 'express';

const router = Router();

// GET /api/tareas - Obtener tareas (con filtro opcional)
router.get('/', (req, res) => {
  // req.query nos permite leer parámetros de la URL (ej: ?completada=0)
  const { completada } = req.query; 

  // Empezamos la consulta base
  let query = `
    SELECT t.*, u_creador.nombre as nombre_creador, u_completado.nombre as nombre_completado
    FROM tareas t
    LEFT JOIN usuarios u_creador ON t.creador_id = u_creador.id
    LEFT JOIN usuarios u_completado ON t.completado_por_id = u_completado.id
  `;

  const params = [];

  // Si nos pasan el filtro, lo añadimos a la consulta
  if (completada !== undefined) {
    query += ' WHERE t.completada = ?';
    params.push(parseInt(completada)); // 0 = pendiente, 1 = completada
  }

  // Ordenamos por las más recientes y limitamos a 50 para no saturar
  query += ' ORDER BY t.fecha_creacion DESC LIMIT 50';

  const tareas = req.db.prepare(query).all(...params);
  res.json(tareas);
});

// POST /api/tareas - Crear una nueva tarea
router.post('/', (req, res) => {
  const { descripcion, creador_id } = req.body; // req.body trae los datos enviados por el frontend
  
  if (!descripcion || !creador_id) {
    return res.status(400).json({ error: 'Faltan datos (descripcion y creador_id)' });
  }

  const stmt = req.db.prepare('INSERT INTO tareas (descripcion, creador_id) VALUES (?, ?)');
  const result = stmt.run(descripcion, creador_id);

  // Devolvemos la tarea recién creada con su nuevo ID
  res.status(201).json({ 
    id: result.lastInsertRowid, 
    descripcion, 
    creador_id,
    completada: 0 
  });
});

// PUT /api/tareas/:id - Marcar tarea como completada o pendiente
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { completada, completado_por_id } = req.body;

  let query = 'UPDATE tareas SET completada = ?';
  const params = [completada];

  if (completada) {
    // Si se marca como completada, guardamos quién la hizo y la fecha
    query += ', completado_por_id = ?, fecha_completado = CURRENT_TIMESTAMP';
    params.push(completado_por_id);
  } else {
    // Si se vuelve a marcar como pendiente, borramos esos datos
    query += ', completado_por_id = NULL, fecha_completado = NULL';
  }

  query += ' WHERE id = ?';
  params.push(id);

  req.db.prepare(query).run(...params);
  res.json({ success: true });
});

export default router;