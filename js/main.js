let produtoEmEdicaoId = null;

const API_URL = "http://localhost:8080/produtos";

const formProduto = document.getElementById("form-produto");
const inputNome = document.getElementById("nome");
const inputPreco = document.getElementById("preco");
const listaProdutos = document.getElementById("lista-produtos");
const botaoSalvar = document.getElementById("botao-salvar");

async function carregarProdutos() {
    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            listaProdutos.innerHTML = "<p>Erro ao carregar produtos.</p>";
            return;
        }

        const produtos = await response.json();

        listaProdutos.innerHTML = "";

        produtos.forEach(produto => {
            listaProdutos.innerHTML += `
                <p>
                    ${produto.Nome} - R$ ${produto.Preco}

                    <button onclick="editarProduto(${produto.ID}, '${produto.Nome}', ${produto.Preco})">
                        Editar
                    </button>

                    <button onclick="excluirProduto(${produto.ID})">
                        Excluir
                    </button>
                </p>
            `;
        });

    } catch (erro) {
        listaProdutos.innerHTML = "<p>Não foi possível conectar ao servidor.</p>";
    }
}

async function excluirProduto(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE"
        });

        if (!response.ok) {
            const mensagemErro = await response.text();
            alert(mensagemErro);
            return;
        }

        carregarProdutos();

    } catch (erro) {
        alert("Não foi possível conectar ao servidor.");
    }
}

function editarProduto(id, nome, preco) {
    produtoEmEdicaoId = id;

    inputNome.value = nome;
    inputPreco.value = preco;

    botaoSalvar.textContent = "Salvar";
}

formProduto.addEventListener("submit", async function (event) {
    event.preventDefault();

    const produto = {
        Nome: inputNome.value,
        Preco: Number(inputPreco.value)
    };

    try {
        let response;

        if (produtoEmEdicaoId === null) {
            response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(produto)
            });
        } else {
            response = await fetch(`${API_URL}/${produtoEmEdicaoId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(produto)
            });
        }

        if (!response.ok) {
            const mensagemErro = await response.text();
            alert(mensagemErro);
            return;
        }

        produtoEmEdicaoId = null;

        inputNome.value = "";
        inputPreco.value = "";

        botaoSalvar.textContent = "Cadastrar";

        carregarProdutos();

    } catch (erro) {
        alert("Não foi possível conectar ao servidor.");
    }
});

carregarProdutos();