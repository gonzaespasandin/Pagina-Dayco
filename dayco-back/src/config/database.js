import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = join(__dirname, '../../database.db');

const db = new Database(dbPath);

db.pragma('journal_mode = WAL');

const inicializarDB = () => {
    db.exec(`
      CREATE TABLE IF NOT EXISTS productos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        titulo TEXT NOT NULL,
        descripcion TEXT,
        imagen_url TEXT,
        creado_en DATETIME DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS nosotros_stats (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        titulo TEXT NOT NULL,
        valor TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS casinos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        logo_url TEXT,
        orden INTEGER DEFAULT 0
      );
    `);

    // Migración: agregar columnas de detalle a productos si no existen.
    // SQLite no soporta ALTER TABLE ADD COLUMN IF NOT EXISTS, así que usamos try/catch.
    const columnasMigracion = [
      'subtitulo TEXT',
      'descripcion_larga TEXT',
      'features_hero TEXT',     // JSON: [{icono, texto}]
      'caracteristicas TEXT',   // JSON: [{icono, titulo, descripcion}]
      'galeria TEXT',           // JSON: [{url, caption}]
      'especificaciones TEXT',  // JSON: [{label, valor}]
      'variantes TEXT',         // JSON: [{nombre, detalle}]
      'aplicaciones TEXT',      // JSON: [{icono, nombre}]
    ];

    for (const columna of columnasMigracion) {
      try {
        db.exec(`ALTER TABLE productos ADD COLUMN ${columna}`);
      } catch {
        // La columna ya existe, se ignora el error y se continúa
      }
    }

    console.log('Base de datos inicializada correctamente');
  };

inicializarDB();

export default db;