import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import Database from 'better-sqlite3';
import { initDatabase } from './models/init-db.js';
import usuariosRouter from './routes/usuarios.js';
import tareasRouter from './routes/tareas.js';
import mensajesRouter from './routes/mensajes.js';
import eventosRouter from './routes/eventos.js';
import turnosRouter from './routes/turnos.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(join(__dirname, 'public')));
// Middleware para pasar la base de datos a las rutas
app.use((req, res, next) => {
  req.db = db;
  next();
});
// Rutas de la API
app.use('/api/usuarios', usuariosRouter);
app.use('/api/tareas', tareasRouter);
app.use('/api/mensajes', mensajesRouter);
app.use('/api/eventos', eventosRouter);
app.use('/api/turnos', turnosRouter);

// Conectar a la base de datos
const db = new Database(join(__dirname, '..', 'database', 'farmacia.db'));

// Inicializar las tablas de la base de datos
initDatabase(db);

// Ruta de prueba

app.get('/api/test', (req, res) => {
    res.json({ mensaje: 'Servidor funcionando correctamente' });
});

// Iniciar servidor

app.listen(PORT, () => {
    console.log(`Serivdor corriendo en http://localhost:${PORT}`);
});