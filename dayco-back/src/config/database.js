// Creamos un "pool" de conexiones a MariaDB.
// Un pool es como un grupo de conexiones pre-abiertas que se reutilizan,
// en vez de abrir y cerrar una conexión nueva en cada consulta (que es lento).
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'mi_base',
    waitForConnections: true,
    connectionLimit: 10,
});

export default pool;
