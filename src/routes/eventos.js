// src/routes/eventos.js
import { Router } from 'express';

const router = Router();

// GET /api/eventos - Obtener todos los eventos
router.get('/', (req, res) => {
  const eventos = req.db.prepare(`
    SELECT e.*, u.nombre as usuario_nombre 
    FROM eventos e 
    LEFT JOIN usuarios u ON e.usuario_id = u.id 
    ORDER BY e.fecha_inicio ASC
  `).all();
  res.json(eventos);
});

// POST /api/eventos - Crear un nuevo evento
router.post('/', (req, res) => {
  const { tipo, titulo, descripcion, fecha_inicio, fecha_fin, usuario_id } = req.body;
  
  const stmt = req.db.prepare(`
    INSERT INTO eventos (tipo, titulo, descripcion, fecha_inicio, fecha_fin, usuario_id) 
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  const result = stmt.run(tipo, titulo, descripcion, fecha_inicio, fecha_fin, usuario_id);

  res.status(201).json({ id: result.lastInsertRowid, ...req.body });
});

// PUT /api/eventos/:id - Actualizar un evento
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { tipo, titulo, descripcion, fecha_inicio, fecha_fin, usuario_id } = req.body;
  
  req.db.prepare(`
    UPDATE eventos 
    SET tipo=?, titulo=?, descripcion=?, fecha_inicio=?, fecha_fin=?, usuario_id=? 
    WHERE id=?
  `).run(tipo, titulo, descripcion, fecha_inicio, fecha_fin, usuario_id, id);

  res.json({ success: true });
});

// DELETE /api/eventos/:id - Borrar un evento
router.delete('/:id', (req, res) => {
  req.db.prepare('DELETE FROM eventos WHERE id=?').run(req.params.id);
  res.json({ success: true });
});

export default router;