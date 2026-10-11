const formFalta = document.getElementById("formFalta");

const selectVendedor = document.getElementById("vendedor");
const selectProduto = document.getElementById("produto");

const inputQuantidadeFalta = document.getElementById("quantidadeFalta");
const inputQuantidadeTotal = document.getElementById("quantidadeTotal");
const inputData = document.getElementById("data");

const tabelaFaltas = document.getElementById("tabelaFaltas");
const pesquisaFalta = document.getElementById("pesquisaFalta");

let vendedoresCarregados = [];
let produtosCarregados = [];
let faltasCarregadas = [];

// ==========================
// INICIALIZAÇÃO
// ==========================

iniciarPagina();

async function iniciarPagina() {
    definirDataAtual();

    await carregarVendedores();
    await carregarProdutos();
    await carregarFaltas();
}

// ==========================
// DATA
// ==========================

function definirDataAtual() {
    const hoje = new Date();

    const ano = hoje.getFullYear();
    const mes = String(hoje.getMonth() + 1).padStart(2, "0");
    const dia = String(hoje.getDate()).padStart(2, "0");

    inputData.value = `${ano}-${mes}-${dia}`;
}

function formatarData(data) {
    const dataObjeto = new Date(data);

    return dataObjeto.toLocaleDateString("pt-BR");
}

// ==========================
// VENDEDORES
// ==========================

async function carregarVendedores() {
    try {
        vendedoresCarregados = await buscarVendedores();

        selectVendedor.innerHTML =
            '<option value="">Selecione um vendedor</option>';

        vendedoresCarregados.forEach(vendedor => {
            const option = document.createElement("option");

            option.value = vendedor.id;
            option.textContent = vendedor.nome;

            selectVendedor.appendChild(option);
        });

    } catch (erro) {
        alert("Erro ao carregar vendedores.");
        console.error(erro);
    }
}

// ==========================
// PRODUTOS
// ==========================

async function carregarProdutos() {
    try {
        produtosCarregados = await buscarProdutos();

        selectProduto.innerHTML =
            '<option value="">Selecione um produto</option>';

        produtosCarregados.forEach(produto => {
            const option = document.createElement("option");

            option.value = produto.id;
            option.textContent = produto.nome;

            selectProduto.appendChild(option);
        });

    } catch (erro) {
        alert("Erro ao carregar produtos.");
        console.error(erro);
    }
}

// ==========================
// QUANTIDADE AUTOMÁTICA
// ==========================

selectProduto.addEventListener("change", function() {
    const produtoId = Number(selectProduto.value);

    if (!produtoId) {
        inputQuantidadeTotal.value = "";
        return;
    }

    const produtoSelecionado = produtosCarregados.find(
        produto => produto.id === produtoId
    );

    if (!produtoSelecionado) {
        inputQuantidadeTotal.value = "";
        return;
    }

    inputQuantidadeTotal.value =
        produtoSelecionado.quantidade_total_carro;
});

// ==========================
// LISTAR FALTAS
// ==========================

async function carregarFaltas() {
    try {
        faltasCarregadas = await buscarFaltas();

        mostrarFaltas(faltasCarregadas);

    } catch (erro) {
        alert("Erro ao carregar faltas.");
        console.error(erro);
    }
}

function mostrarFaltas(faltas) {
    tabelaFaltas.innerHTML = "";

    if (faltas.length === 0) {
        tabelaFaltas.innerHTML = `
            <tr>
                <td colspan="6">
                    Nenhuma falta registrada.
                </td>
            </tr>
        `;

        return;
    }

    faltas.forEach(falta => {
        const linha = document.createElement("tr");

        linha.innerHTML = `
            <td>${formatarData(falta.data)}</td>

            <td>
                ${falta.vendedor?.nome || "-"}
            </td>

            <td>
                ${falta.produto?.nome || "-"}
            </td>

            <td>
                ${falta.quantidade_falta}
            </td>

            <td>
                ${falta.quantidade_total}
            </td>

            <td>
                <button
                    class="btn-editar"
                    onclick="editarFalta(${falta.id})"
                >
                    Editar
                </button>

                <button
                    class="btn-excluir"
                    onclick="excluirFalta(${falta.id})"
                >
                    Excluir
                </button>
            </td>
        `;

        tabelaFaltas.appendChild(linha);
    });
}

// ==========================
// CADASTRAR / EDITAR
// ==========================

formFalta.addEventListener("submit", async function(event) {
    event.preventDefault();

    const falta = {
        vendedor_id: Number(selectVendedor.value),
        produto_id: Number(selectProduto.value),
        quantidade_falta: Number(inputQuantidadeFalta.value),
        data: `${inputData.value}T00:00:00Z`
    };

    const idEditando = formFalta.dataset.editandoId;

    try {
        if (idEditando) {
            await atualizarFalta(idEditando, falta);
        } else {
            await criarFalta(falta);
        }

        limparFormularioFalta();

        await carregarFaltas();

    } catch (erro) {
        alert(erro.message);
        console.error(erro);
    }
});

// ==========================
// EDITAR
// ==========================

async function editarFalta(id) {
    try {
        const falta = await buscarFaltaPorId(id);

        selectVendedor.value = falta.vendedor_id;
        selectProduto.value = falta.produto_id;

        inputQuantidadeFalta.value =
            falta.quantidade_falta;

        inputQuantidadeTotal.value =
            falta.quantidade_total;

        inputData.value =
            falta.data.substring(0, 10);

        formFalta.dataset.editandoId = id;

        const botao = formFalta.querySelector(
            'button[type="submit"]'
        );

        botao.textContent = "Salvar alterações";

        formFalta.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

    } catch (erro) {
        alert("Erro ao buscar falta.");
        console.error(erro);
    }
}

// ==========================
// EXCLUIR
// ==========================

async function excluirFalta(id) {
    const confirmar = confirm(
        "Deseja realmente excluir esta falta?"
    );

    if (!confirmar) {
        return;
    }

    try {
        await excluirFaltaApi(id);

        if (formFalta.dataset.editandoId === String(id)) {
            limparFormularioFalta();
        }

        await carregarFaltas();

    } catch (erro) {
        alert(erro.message);
        console.error(erro);
    }
}

// ==========================
// PESQUISA
// ==========================

pesquisaFalta.addEventListener("input", function() {
    const termo = pesquisaFalta.value
        .toLowerCase()
        .trim();

    const faltasFiltradas =
        faltasCarregadas.filter(falta => {

            const nomeProduto =
                falta.produto?.nome
                    ?.toLowerCase() || "";

            const nomeVendedor =
                falta.vendedor?.nome
                    ?.toLowerCase() || "";

            return (
                nomeProduto.includes(termo) ||
                nomeVendedor.includes(termo)
            );
        });

    mostrarFaltas(faltasFiltradas);
});

// ==========================
// LIMPAR FORMULÁRIO
// ==========================

function limparFormularioFalta() {
    formFalta.reset();

    delete formFalta.dataset.editandoId;

    inputQuantidadeTotal.value = "";

    definirDataAtual();

    const botao = formFalta.querySelector(
        'button[type="submit"]'
    );

    botao.textContent = "Registrar falta";
}