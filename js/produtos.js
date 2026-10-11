const formProduto = document.getElementById("formProduto");
const inputNomeProduto = document.getElementById("nomeProduto");
const inputQuantidadeTotal = document.getElementById("quantidadeTotalCarro");

const tabelaProdutos = document.getElementById("tabelaProdutos");
const pesquisaProduto = document.getElementById("pesquisaProduto");

let produtosCarregados = [];

// ==========================
// INICIALIZAÇÃO
// ==========================

carregarProdutos();

// ==========================
// LISTAR PRODUTOS
// ==========================

async function carregarProdutos() {

    try {

        produtosCarregados = await buscarProdutos();

        mostrarProdutos(produtosCarregados);

    } catch (erro) {

        alert("Erro ao carregar produtos.");

        console.error(erro);
    }
}

function mostrarProdutos(produtos) {

    tabelaProdutos.innerHTML = "";

    produtos.forEach(produto => {

        const linha = document.createElement("tr");

        linha.innerHTML = `
            <td>${produto.nome}</td>

            <td>
                ${produto.quantidade_total_carro}
            </td>

            <td>
                <button
                    class="btn-editar"
                    onclick="editarProduto(${produto.id})"
                >
                    Editar
                </button>

                <button
                    class="btn-excluir"
                    onclick="excluirProduto(${produto.id})"
                >
                    Excluir
                </button>
            </td>
        `;

        tabelaProdutos.appendChild(linha);
    });
}

// ==========================
// CADASTRAR / EDITAR
// ==========================

formProduto.addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();

        const produto = {

            nome:
                inputNomeProduto
                    .value
                    .trim(),

            quantidade_total_carro:
                Number(inputQuantidadeTotal.value)
        };

        const idEditando =
            formProduto.dataset.editandoId;

        try {

            if (idEditando) {

                await atualizarProduto(
                    idEditando,
                    produto
                );

            } else {

                await criarProduto(produto);
            }

            limparFormularioProduto();

            await carregarProdutos();

        } catch (erro) {

            alert(erro.message);

            console.error(erro);
        }
    }
);

// ==========================
// EDITAR
// ==========================

async function editarProduto(id) {

    try {

        const produto =
            await buscarProdutoPorId(id);

        inputNomeProduto.value =
            produto.nome;

        inputQuantidadeTotal.value =
            produto.quantidade_total_carro;

        formProduto.dataset.editandoId =
            id;

        const botao =
            formProduto.querySelector(
                'button[type="submit"]'
            );

        botao.textContent =
            "Salvar alterações";

        inputNomeProduto.focus();

    } catch (erro) {

        alert("Erro ao buscar produto.");

        console.error(erro);
    }
}

// ==========================
// EXCLUIR
// ==========================

async function excluirProduto(id) {

    const confirmar = confirm(
        "Deseja realmente excluir este produto?"
    );

    if (!confirmar) {
        return;
    }

    try {

        await excluirProdutoApi(id);

        if (
            formProduto.dataset.editandoId
            === String(id)
        ) {

            limparFormularioProduto();
        }

        await carregarProdutos();

    } catch (erro) {

        alert(erro.message);

        console.error(erro);
    }
}

// ==========================
// PESQUISA
// ==========================

pesquisaProduto.addEventListener(
    "input",
    function() {

        const termo =
            pesquisaProduto.value
                .toLowerCase()
                .trim();

        const produtosFiltrados =
            produtosCarregados.filter(
                produto =>
                    produto.nome
                        .toLowerCase()
                        .includes(termo)
            );

        mostrarProdutos(
            produtosFiltrados
        );
    }
);

// ==========================
// LIMPAR FORMULÁRIO
// ==========================

function limparFormularioProduto() {

    formProduto.reset();

    delete formProduto.dataset.editandoId;

    const botao =
        formProduto.querySelector(
            'button[type="submit"]'
        );

    botao.textContent =
        "Adicionar produto";
}