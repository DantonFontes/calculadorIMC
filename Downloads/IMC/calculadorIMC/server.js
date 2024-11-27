const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const db = require('./database'); // Importa o arquivo database.js
const cors = require('cors');

const app = express();
const PORT = 3000;
const saltRounds = 10; // Número de saltos para hashing

app.use(cors());

// Middleware para processar JSON
app.use(bodyParser.json());

// Rota GET básica para testar o servidor
app.get('/', (req, res) => {
    res.send('Servidor está funcionando!');
});

// Endpoint para registrar um novo usuário
app.post('/register', (req, res) => {
    console.log('Rota /register acionada!');
    const { name, email, password } = req.body;

    // Validação de dados
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Nome, email e senha são obrigatórios!' });
    }

    // Criptografar a senha
    bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
        if (err) {
            return res.status(500).json({ message: 'Erro ao registrar usuário.' });
        }

        const query = `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`; 

        db.run(query, [name, email, hashedPassword], function (err) {
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
});

// Endpoint para login do usuário
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    // Validação de dados
    if (!email || !password) {
        return res.status(400).json({ message: 'Email e senha são obrigatórios!' });
    }

    const query = `SELECT * FROM users WHERE email = ?`;

    db.get(query, [email], (err, user) => {
        if (err) {
            return res.status(500).json({ message: 'Erro ao processar login.' });
        } else if (!user) {
            return res.status(401).json({ message: 'Credenciais inválidas!' });
        }

        // Verificar se a senha fornecida corresponde à senha criptografada
        bcrypt.compare(password, user.password, (err, result) => {
            if (err) {
                return res.status(500).json({ message: 'Erro ao processar login.' });
            }

            if (!result) {
                return res.status(401).json({ message: 'Credenciais inválidas!' });
            }

            res.json({ message: 'Login bem-sucedido!', user });
        });
    });
});

// Endpoint para salvar um cálculo de IMC
app.post('/save-imc', (req, res) => {
    const { email, imc, classification } = req.body;

    // Validação de dados
    if (!email || !imc || !classification) {
        return res.status(400).json({ message: 'Email, IMC e classificação são obrigatórios!' });
    }

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

    // Validação de dados
    if (!email || !name || !password) {
        return res.status(400).json({ message: 'Email, nome e senha são obrigatórios!' });
    }

    const query = `UPDATE users SET name = ?, password = ? WHERE email = ?`;

    bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
        if (err) {
            return res.status(500).json({ message: 'Erro ao atualizar senha.' });
        }

        db.run(query, [name, hashedPassword, email], function (err) {
            if (err) {
                res.status(500).json({ message: 'Erro ao atualizar usuário.' });
            } else {
                res.json({ message: 'Usuário atualizado com sucesso!' });
            }
        });
    });
});

// Endpoint para deletar um usuário
app.delete('/delete-user', (req, res) => {
    const { email } = req.body;

    // Validação de dados
    if (!email) {
        return res.status(400).json({ message: 'Email é obrigatório!' });
    }

    const query = `SELECT * FROM users WHERE email = ?`;

    db.get(query, [email], (err, user) => {
        if (err) {
            return res.status(500).json({ message: 'Erro ao processar a solicitação.' });
        } else if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado!' });
        }

        const deleteQuery = `DELETE FROM users WHERE email = ?`;

        db.run(deleteQuery, [email], function (err) {
            if (err) {
                return res.status(500).json({ message: 'Erro ao deletar usuário.' });
            } else {
                res.json({ message: 'Usuário deletado com sucesso!' });
            }
        });
    });
});

// Endpoint para atualizar o IMC
app.put('/update-imc', (req, res) => {
    const { email, imc, classification } = req.body;

    // Validação de dados
    if (!email || !imc || !classification) {
        return res.status(400).json({ message: 'Email, IMC e classificação são obrigatórios!' });
    }

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

    // Validação de dados
    if (!email) {
        return res.status(400).json({ message: 'Email é obrigatório!' });
    }

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
