import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import Database from 'better-sqlite3';
import { initDatabase } from './models/init-db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(join(__dirname, 'public')));

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