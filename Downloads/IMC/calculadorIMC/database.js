const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Cria ou abre o banco de dados
const dbPath = path.resolve(__dirname, 'database.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err.message);
    } else {
        console.log('Conectado ao banco de dados SQLite.');
        
        // Ativar o suporte a chaves estrangeiras
        db.run('PRAGMA foreign_keys = ON;', (err) => {
            if (err) {
                console.error('Erro ao ativar chaves estrangeiras:', err.message);
            } else {
                console.log('Chaves estrangeiras ativadas.');
            }
        });
    }
});

// Criação das tabelas com tratamento de erro
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
        )
    `, (err) => {
        if (err) {
            console.error('Erro ao criar a tabela users:', err.message);
        } else {
            console.log('Tabela users criada ou já existente.');
        }
    });

    db.run(`
        CREATE TABLE IF NOT EXISTS imcs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            imc REAL NOT NULL,
            classification TEXT NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
        )
    `, (err) => {
        if (err) {
            console.error('Erro ao criar a tabela imcs:', err.message);
        } else {
            console.log('Tabela imcs criada ou já existente.');
        }
    });
});

module.exports = db;
