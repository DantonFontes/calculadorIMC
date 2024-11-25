const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Serve arquivos estáticos da pasta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Simulação de banco de dados
const users = [];
const savedIMCs = [];

// Endpoint de cadastro
app.post('/register', (req, res) => {
    const { name, email, password } = req.body;
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
        return res.status(400).json({ message: 'Email já cadastrado!' });
    }
    users.push({ name, email, password });
    res.status(201).json({ message: 'Usuário cadastrado com sucesso!' });
});

// Endpoint de login
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const user = users.find(user => user.email === email && user.password === password);
    if (!user) {
        return res.status(401).json({ message: 'Credenciais inválidas!' });
    }
    res.json({ message: 'Login bem-sucedido!', user });
});

// Endpoint para salvar IMC
app.post('/save-imc', (req, res) => {
    const { email, imc, classification } = req.body;
    savedIMCs.push({ email, imc, classification });
    res.status(201).json({ message: 'IMC salvo com sucesso!' });
});

// Endpoint para listar IMCs salvos
app.get('/imcs', (req, res) => {
    const { email } = req.query;
    const userIMCs = savedIMCs.filter(imc => imc.email === email);
    res.json(userIMCs);
});

// Rota principal para carregar o index.html
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Inicializa o servidor
const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
app.use((req, res, next) => {
    console.log(`Requisição recebida: ${req.method} ${req.url}`);
        next();
});
