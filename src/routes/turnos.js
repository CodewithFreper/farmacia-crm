// src/routes/turnos.js
import { Router } from 'express';

const router = Router();

// GET /api/turnos - Obtener todos los turnos
router.get('/', (req, res) => {
  const turnos = req.db.prepare(`
    SELECT t.*, u.nombre as usuario_nombre 
    FROM turnos t 
    LEFT JOIN usuarios u ON t.usuario_id = u.id 
    ORDER BY t.fecha ASC
  `).all();
  res.json(turnos);
});

// POST /api/turnos - Crear un nuevo turno
router.post('/', (req, res) => {
  const { usuario_id, fecha, tipo_turno } = req.body;
  
  const stmt = req.db.prepare('INSERT INTO turnos (usuario_id, fecha, tipo_turno) VALUES (?, ?, ?)');
  const result = stmt.run(usuario_id, fecha, tipo_turno);

  res.status(201).json({ id: result.lastInsertRowid, ...req.body });
});

// DELETE /api/turnos/:id - Borrar un turno
router.delete('/:id', (req, res) => {
  req.db.prepare('DELETE FROM turnos WHERE id=?').run(req.params.id);
  res.json({ success: true });
});

export default router;