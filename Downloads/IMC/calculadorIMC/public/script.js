let sexoSelecionado = ""; // Variável para armazenar o sexo escolhido

// Seleção dos botões de sexo
const masculinoBtn = document.getElementById("masculino");
const femininoBtn = document.getElementById("feminino");

// Função para alternar o estado ativo dos botões
function selecionarSexo(sexo) {
    sexoSelecionado = sexo;
    masculinoBtn.classList.toggle("active", sexo === "masculino");
    femininoBtn.classList.toggle("active", sexo === "feminino");
}

// Eventos de clique nos botões
masculinoBtn.addEventListener("click", () => selecionarSexo("masculino"));
femininoBtn.addEventListener("click", () => selecionarSexo("feminino"));

// Calculadora de IMC
document.getElementById("calcularIMC").addEventListener("click", async () => {
    const peso = parseFloat(document.getElementById("peso").value);
    const altura = parseFloat(document.getElementById("altura").value);
    const resultadoDiv = document.getElementById("resultado");

    // Validações
    if (!sexoSelecionado || isNaN(peso) || peso <= 0 || isNaN(altura) || altura <= 0) {
        resultadoDiv.innerHTML = `<p style="color: red;">Por favor, preencha todos os campos corretamente.</p>`;
        return;
    }

    // Cálculo do IMC
    const imc = peso / (altura * altura);
    let classificacao = "";

    // Definir classificação com base no IMC
    if (imc < 18.5) {
        classificacao = "Abaixo do peso";
    } else if (imc >= 18.5 && imc < 24.9) {
        classificacao = "Peso normal";
    } else if (imc >= 25 && imc < 29.9) {
        classificacao = "Sobrepeso";
    } else {
        classificacao = "Obesidade";
    }

    // Exibir resultado
    resultadoDiv.innerHTML = `
        <p>IMC: <strong>${imc.toFixed(2)}</strong></p>
        <p>Classificação: <strong>${classificacao}</strong></p>
        <p>Sexo: <strong>${sexoSelecionado.charAt(0).toUpperCase() + sexoSelecionado.slice(1)}</strong></p>
    `;

    // Salvar IMC no backend (se autenticado)
    const saveArea = document.getElementById("saveArea");
    const email = sessionStorage.getItem("email"); // Armazene o email ao fazer login

    if (email) {
        saveArea.style.display = "block"; // Exibe a área de salvar IMC se o usuário estiver logado

        try {
            const response = await fetch("http://localhost:8080/save-imc", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    imc,
                    classification: classificacao
                }),
            });

            if (response.ok) {
                alert("IMC salvo com sucesso!");
            } else {
                const error = await response.json();
                alert(error.message);
            }
        } catch (error) {
            console.error("Erro ao salvar IMC:", error);
            alert("Erro ao se conectar com o servidor.");
        }
    } else {
        alert("Você precisa estar logado para salvar o IMC.");
    }
});

// Função de login
document.getElementById("formLogin").addEventListener("submit", async function (event) {
    event.preventDefault(); // Previne o envio tradicional do formulário

    const email = document.getElementById("emailLogin").value;
    const senha = document.getElementById("senhaLogin").value;

    try {
        const response = await fetch("http://localhost:8080/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password: senha })
        });

        const data = await response.json();

        if (data.message === "Login bem-sucedido!") {
            alert("Login realizado com sucesso!");
            sessionStorage.setItem("email", email); // Armazena o email no sessionStorage
            window.location.href = "/"; // Redireciona para a página inicial
        } else {
            alert(data.message); // Exibe mensagem de erro caso as credenciais sejam inválidas
        }
    } catch (error) {
        console.error("Erro no login:", error);
        alert("Erro ao tentar fazer login.");
    }
});
