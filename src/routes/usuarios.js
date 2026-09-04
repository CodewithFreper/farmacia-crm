// src/routes/usuarios.js
import { Router } from 'express';

const router = Router();

// GET /api/usuarios - Obtener todos los usuarios
router.get('/', (req, res) => {
  // req.db viene del middleware que añadiremos después
  const usuarios = req.db.prepare('SELECT * FROM usuarios ORDER BY nombre').all();
  res.json(usuarios);
});

// GET /api/usuarios/:id - Obtener un usuario por su ID
router.get('/:id', (req, res) => {
  const usuario = req.db.prepare('SELECT * FROM usuarios WHERE id = ?').get(req.params.id);
  
  if (!usuario) {
    return res.status(404).json({ error: 'Usuario no encontrado' });
  }
  
  res.json(usuario);
});

export default router;