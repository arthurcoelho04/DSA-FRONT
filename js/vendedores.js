const formVendedor = document.getElementById("formVendedor");
const inputNomeVendedor = document.getElementById("nomeVendedor");

const formRota = document.getElementById("formRota");
const selectVendedorRota = document.getElementById("vendedorRota");
const inputCidade = document.getElementById("cidade");
const inputBairro = document.getElementById("bairro");

const listaRotas = document.getElementById("listaRotas");
const tabelaVendedores = document.getElementById("tabelaVendedores");
const pesquisaVendedor = document.getElementById("pesquisaVendedor");

let vendedoresCarregados = [];
let rotasCarregadas = [];

// ==========================
// INICIALIZAÇÃO
// ==========================

iniciarPagina();

async function iniciarPagina() {
    await carregarVendedores();
    await carregarRotas();
}

// ==========================
// VENDEDORES
// ==========================

async function carregarVendedores() {
    try {
        vendedoresCarregados = await buscarVendedores();

        preencherSelectVendedores();
        mostrarVendedores(vendedoresCarregados);

    } catch (erro) {
        alert("Erro ao carregar vendedores.");
        console.error(erro);
    }
}

function preencherSelectVendedores() {
    selectVendedorRota.innerHTML =
        '<option value="">Selecione um vendedor</option>';

    vendedoresCarregados.forEach(vendedor => {
        const option = document.createElement("option");

        option.value = vendedor.id;
        option.textContent = vendedor.nome;

        selectVendedorRota.appendChild(option);
    });
}

function mostrarVendedores(vendedores) {
    tabelaVendedores.innerHTML = "";

    vendedores.forEach(vendedor => {

        const quantidadeRotas = rotasCarregadas.filter(
            rota => rota.vendedor_id === vendedor.id
        ).length;

        const linha = document.createElement("tr");

        linha.innerHTML = `
            <td>${vendedor.nome}</td>

            <td>
                ${quantidadeRotas} rota${quantidadeRotas === 1 ? "" : "s"}
            </td>

            <td>
                <button
                    class="btn-editar"
                    onclick="editarVendedor(${vendedor.id})"
                >
                    Editar
                </button>

                <button
                    class="btn-excluir"
                    onclick="excluirVendedor(${vendedor.id})"
                >
                    Excluir
                </button>
            </td>
        `;

        tabelaVendedores.appendChild(linha);
    });
}

// ==========================
// CADASTRAR / EDITAR VENDEDOR
// ==========================

formVendedor.addEventListener("submit", async function(event) {
    event.preventDefault();

    const vendedor = {
        nome: inputNomeVendedor.value.trim()
    };

    const idEditando = formVendedor.dataset.editandoId;

    try {

        if (idEditando) {
            await atualizarVendedor(idEditando, vendedor);
        } else {
            await criarVendedor(vendedor);
        }

        limparFormularioVendedor();

        await carregarVendedores();
        await carregarRotas();

    } catch (erro) {
        alert(erro.message);
        console.error(erro);
    }
});

async function editarVendedor(id) {
    try {
        const vendedor = await buscarVendedorPorId(id);

        inputNomeVendedor.value = vendedor.nome;

        formVendedor.dataset.editandoId = id;

        const botao = formVendedor.querySelector(
            'button[type="submit"]'
        );

        botao.textContent = "Salvar alterações";

        inputNomeVendedor.focus();

    } catch (erro) {
        alert("Erro ao buscar vendedor.");
        console.error(erro);
    }
}

async function excluirVendedor(id) {
    const confirmar = confirm(
        "Deseja realmente excluir este vendedor?"
    );

    if (!confirmar) {
        return;
    }

    try {
        await excluirVendedorApi(id);

        if (formVendedor.dataset.editandoId === String(id)) {
            limparFormularioVendedor();
        }

        if (selectVendedorRota.value === String(id)) {
            selectVendedorRota.value = "";
            listaRotas.innerHTML = "";
        }

        await carregarVendedores();
        await carregarRotas();

    } catch (erro) {
        alert(erro.message);
        console.error(erro);
    }
}

function limparFormularioVendedor() {
    formVendedor.reset();

    delete formVendedor.dataset.editandoId;

    const botao = formVendedor.querySelector(
        'button[type="submit"]'
    );

    botao.textContent = "Adicionar vendedor";
}

// ==========================
// ROTAS
// ==========================

async function carregarRotas() {
    try {
        rotasCarregadas = await buscarRotas();

        mostrarVendedores(vendedoresCarregados);

        if (selectVendedorRota.value) {
            mostrarRotasDoVendedor(
                Number(selectVendedorRota.value)
            );
        }

    } catch (erro) {
        alert("Erro ao carregar rotas.");
        console.error(erro);
    }
}

formRota.addEventListener("submit", async function(event) {
    event.preventDefault();

    const vendedorId = Number(selectVendedorRota.value);

    const rota = {
        cidade: inputCidade.value.trim(),
        bairro: inputBairro.value.trim(),
        vendedor_id: vendedorId
    };

    try {
        await criarRota(rota);

        inputCidade.value = "";
        inputBairro.value = "";

        await carregarRotas();

        mostrarRotasDoVendedor(vendedorId);

    } catch (erro) {
        alert(erro.message);
        console.error(erro);
    }
});

selectVendedorRota.addEventListener("change", function() {
    const vendedorId = Number(selectVendedorRota.value);

    if (!vendedorId) {
        listaRotas.innerHTML = "";
        return;
    }

    mostrarRotasDoVendedor(vendedorId);
});

function mostrarRotasDoVendedor(vendedorId) {
    const rotasDoVendedor = rotasCarregadas.filter(
        rota => rota.vendedor_id === vendedorId
    );

    listaRotas.innerHTML = "";

    if (rotasDoVendedor.length === 0) {
        listaRotas.innerHTML =
            "<p>Nenhuma rota cadastrada para este vendedor.</p>";
        return;
    }

    rotasDoVendedor.forEach(rota => {

        const item = document.createElement("div");

        item.classList.add("rota-item");

        item.innerHTML = `
            <span>
                ${rota.cidade} - ${rota.bairro}
            </span>

            <button
                type="button"
                onclick="excluirRota(${rota.id})"
            >
                Excluir
            </button>
        `;

        listaRotas.appendChild(item);
    });
}

async function excluirRota(id) {
    const confirmar = confirm(
        "Deseja realmente excluir esta rota?"
    );

    if (!confirmar) {
        return;
    }

    try {
        await excluirRotaApi(id);

        const vendedorId = Number(selectVendedorRota.value);

        await carregarRotas();

        if (vendedorId) {
            mostrarRotasDoVendedor(vendedorId);
        }

    } catch (erro) {
        alert(erro.message);
        console.error(erro);
    }
}

// ==========================
// PESQUISA
// ==========================

pesquisaVendedor.addEventListener("input", function() {
    const termo = pesquisaVendedor.value
        .toLowerCase()
        .trim();

    const vendedoresFiltrados =
        vendedoresCarregados.filter(
            vendedor =>
                vendedor.nome
                    .toLowerCase()
                    .includes(termo)
        );

    mostrarVendedores(vendedoresFiltrados);
});