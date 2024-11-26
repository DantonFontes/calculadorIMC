const express = require('express');
const bodyParser = require('body-parser');
const db = require('./database'); // Importa o arquivo database.js

const app = express();
const PORT = 8080;

// Middleware para processar JSON
app.use(bodyParser.json());

// Endpoint para registrar um novo usuário
app.post('/register', (req, res) => {
    const { name, email, password } = req.body;

    const query = `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`;

    db.run(query, [name, email, password], function (err) {
        if (err) {
            if (err.message.includes('UNIQUE')) {
                res.status(400).json({ message: 'Email já cadastrado!' });
            } else {
                res.status(500).json({ message: 'Erro ao registrar usuário.' });
            }
        } else {
            res.status(201).json({ message: 'Usuário cadastrado com sucesso!' });
        }
    });
});

// Endpoint para login do usuário
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    const query = `SELECT * FROM users WHERE email = ? AND password = ?`;

    db.get(query, [email, password], (err, user) => {
        if (err) {
            res.status(500).json({ message: 'Erro ao processar login.' });
        } else if (!user) {
            res.status(401).json({ message: 'Credenciais inválidas!' });
        } else {
            res.json({ message: 'Login bem-sucedido!', user });
        }
    });
});

// Endpoint para salvar um cálculo de IMC
app.post('/save-imc', (req, res) => {
    const { email, imc, classification } = req.body;

    const query = `INSERT INTO imcs (email, imc, classification) VALUES (?, ?, ?)`;

    db.run(query, [email, imc, classification], function (err) {
        if (err) {
            res.status(500).json({ message: 'Erro ao salvar o IMC.' });
        } else {
            res.status(201).json({ message: 'IMC salvo com sucesso!' });
        }
    });
});

// Endpoint para atualizar um usuário
app.put('/update-user', (req, res) => {
    const { email, name, password } = req.body;

    const query = `UPDATE users SET name = ?, password = ? WHERE email = ?`;

    db.run(query, [name, password, email], function (err) {
        if (err) {
            res.status(500).json({ message: 'Erro ao atualizar usuário.' });
        } else {
            res.json({ message: 'Usuário atualizado com sucesso!' });
        }
    });
});

// Endpoint para deletar um usuário
app.delete('/delete-user', (req, res) => {
    const { email } = req.body;

    const query = `DELETE FROM users WHERE email = ?`;

    db.run(query, [email], function (err) {
        if (err) {
            res.status(500).json({ message: 'Erro ao deletar usuário.' });
        } else {
            res.json({ message: 'Usuário deletado com sucesso!' });
        }
    });
});

// Endpoint para atualizar o IMC
app.put('/update-imc', (req, res) => {
    const { email, imc, classification } = req.body;

    const query = `UPDATE imcs SET imc = ?, classification = ? WHERE email = ?`;

    db.run(query, [imc, classification, email], function (err) {
        if (err) {
            res.status(500).json({ message: 'Erro ao atualizar IMC.' });
        } else {
            res.json({ message: 'IMC atualizado com sucesso!' });
        }
    });
});

// Endpoint para deletar um IMC
app.delete('/delete-imc', (req, res) => {
    const { email } = req.body;

    const query = `DELETE FROM imcs WHERE email = ?`;

    db.run(query, [email], function (err) {
        if (err) {
            res.status(500).json({ message: 'Erro ao deletar IMC.' });
        } else {
            res.json({ message: 'IMC deletado com sucesso!' });
        }
    });
});

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
