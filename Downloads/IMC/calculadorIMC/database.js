const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Cria ou abre o banco de dados
const dbPath = path.resolve(__dirname, 'database.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err.message);
    } else {
        console.log('Conectado ao banco de dados SQLite.');
    }
});

// Cria tabelas, se não existirem
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS imcs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT NOT NULL,
            imc REAL NOT NULL,
            classification TEXT NOT NULL,
            FOREIGN KEY (email) REFERENCES users (email)
        )
    `);
});

module.exports = db;
