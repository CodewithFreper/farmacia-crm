// src/routes/mensajes.js
import { Router } from 'express';

const router = Router();

// GET /api/mensajes - Obtener todos los mensajes con sus respuestas
router.get('/', (req, res) => {
  // Primero obtenemos todos los mensajes con el nombre del autor
  const mensajes = req.db.prepare(`
    SELECT m.*, u.nombre as autor_nombre
    FROM mensajes m
    LEFT JOIN usuarios u ON m.autor_id = u.id
    ORDER BY m.fecha_creacion DESC
    LIMIT 50
  `).all();

  // Para cada mensaje, obtenemos sus respuestas
  const mensajesConRespuestas = mensajes.map(mensaje => {
    const respuestas = req.db.prepare(`
      SELECT r.*, u.nombre as autor_nombre
      FROM respuestas r
      LEFT JOIN usuarios u ON r.autor_id = u.id
      WHERE r.mensaje_id = ?
      ORDER BY r.fecha_creacion ASC
    `).all(mensaje.id);

    return {
      ...mensaje,
      respuestas: respuestas
    };
  });

  res.json(mensajesConRespuestas);
});

// POST /api/mensajes - Crear un nuevo mensaje
router.post('/', (req, res) => {
  const { titulo, contenido, autor_id } = req.body;
  
  if (!titulo || !contenido || !autor_id) {
    return res.status(400).json({ error: 'Faltan datos (titulo, contenido, autor_id)' });
  }

  const stmt = req.db.prepare('INSERT INTO mensajes (titulo, contenido, autor_id) VALUES (?, ?, ?)');
  const result = stmt.run(titulo, contenido, autor_id);

  res.status(201).json({ 
    id: result.lastInsertRowid, 
    titulo, 
    contenido, 
    autor_id 
  });
});

// POST /api/mensajes/:id/respuestas - Añadir una respuesta a un mensaje
router.post('/:id/respuestas', (req, res) => {
  const { id } = req.params;
  const { contenido, autor_id } = req.body;
  
  if (!contenido || !autor_id) {
    return res.status(400).json({ error: 'Faltan datos (contenido, autor_id)' });
  }

  const stmt = req.db.prepare('INSERT INTO respuestas (mensaje_id, contenido, autor_id) VALUES (?, ?, ?)');
  const result = stmt.run(id, contenido, autor_id);

  res.status(201).json({ 
    id: result.lastInsertRowid, 
    mensaje_id: id,
    contenido, 
    autor_id 
  });
});

export default router;