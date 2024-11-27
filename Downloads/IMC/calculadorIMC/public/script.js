document.addEventListener("DOMContentLoaded", function () {
    // Seção de login e cadastro
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    // Seção de cálculo IMC
    const calcularBtn = document.getElementById('calcularIMC');
    const resultadoDiv = document.getElementById('resultado');
    const saveArea = document.getElementById('saveArea');
    const salvarCalculoBtn = document.getElementById('salvarCalculo');
    const nomeCalculoInput = document.getElementById('nomeCalculo');
    
    // Variáveis para o controle de sexo
    const masculinoBtn = document.getElementById('masculino');
    const femininoBtn = document.getElementById('feminino');
    let sexoSelecionado = "";
    
    // Login
    if (loginForm) {
        loginForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                const response = await fetch('http://localhost:5000/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();
                if (response.ok) {
                    // Guarda o email no localStorage para controle do login
                    localStorage.setItem('email', email);
                    window.location.href = 'imc.html';  // Redireciona para página de IMC
                } else {
                    alert(data.message);
                }
            } catch (error) {
                alert('Erro ao fazer login. Tente novamente.');
            }
        });
    }

    // Cadastro
    if (registerForm) {
        registerForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                const response = await fetch('http://localhost:5000/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, password })
                });

                const data = await response.json();
                if (response.ok) {
                    window.location.href = 'login.html';  // Redireciona para página de login
                } else {
                    alert(data.message);
                }
            } catch (error) {
                alert('Erro ao tentar cadastrar. Tente novamente.');
            }
        });
    }

    // Função para calcular o IMC
    calcularBtn.addEventListener("click", function () {
        const peso = parseFloat(document.getElementById('peso').value);
        const altura = parseFloat(document.getElementById('altura').value);

        if (peso > 0 && altura > 0) {
            let imc = peso / (altura * altura);
            resultadoDiv.innerText = `Seu IMC é: ${imc.toFixed(2)}`;
            saveArea.style.display = 'flex';  // Exibe a área para salvar o cálculo
        } else {
            alert("Por favor, preencha os valores de peso e altura corretamente.");
        }
    });

    // Função para salvar o IMC no banco de dados
    salvarCalculoBtn.addEventListener("click", async function () {
        const imc = resultadoDiv.innerText.split(': ')[1];
        const nomeCalculo = nomeCalculoInput.value;
        const email = localStorage.getItem('email');

        if (!email) {
            alert("Você precisa estar logado para salvar o cálculo.");
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/save-imc', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, imc, classification: nomeCalculo })
            });

            const data = await response.json();
            if (response.ok) {
                alert('IMC salvo com sucesso!');
            } else {
                alert(data.message);
            }
        } catch (error) {
            alert('Erro ao salvar o IMC. Tente novamente.');
        }
    });

    // Funções para a seleção de sexo
    masculinoBtn.addEventListener("click", function () {
        sexoSelecionado = "masculino";
        masculinoBtn.classList.add("active");
        femininoBtn.classList.remove("active");
    });

    femininoBtn.addEventListener("click", function () {
        sexoSelecionado = "feminino";
        femininoBtn.classList.add("active");
        masculinoBtn.classList.remove("active");
    });
});
