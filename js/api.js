const API_URL = "http://localhost:8080";

// ==========================
// FUNÇÃO BASE
// ==========================

async function request(endpoint, options = {}) {

    try {

        const resposta = await fetch(
            `${API_URL}${endpoint}`,
            options
        );

        if (!resposta.ok) {

            const mensagem = await resposta.text();

            throw new Error(
                mensagem || "Erro ao realizar requisição."
            );
        }

        // DELETE retorna 204 sem conteúdo
        if (resposta.status === 204) {
            return null;
        }

        return await resposta.json();

    } catch (erro) {

        console.error(
            `Erro na requisição ${endpoint}:`,
            erro
        );

        throw erro;
    }
}

// ==========================
// PRODUTOS
// ==========================

async function buscarProdutos() {
    return request("/produtos");
}

async function buscarProdutoPorId(id) {
    return request(`/produtos/${id}`);
}

async function criarProduto(produto) {

    return request("/produtos", {
        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(produto)
    });
}

async function atualizarProduto(id, produto) {

    return request(`/produtos/${id}`, {
        method: "PUT",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(produto)
    });
}

async function excluirProdutoApi(id) {

    return request(`/produtos/${id}`, {
        method: "DELETE"
    });
}

// ==========================
// VENDEDORES
// ==========================

async function buscarVendedores() {
    return request("/vendedores");
}

async function buscarVendedorPorId(id) {
    return request(`/vendedores/${id}`);
}

async function criarVendedor(vendedor) {

    return request("/vendedores", {
        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(vendedor)
    });
}

async function atualizarVendedor(id, vendedor) {

    return request(`/vendedores/${id}`, {
        method: "PUT",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(vendedor)
    });
}

async function excluirVendedorApi(id) {

    return request(`/vendedores/${id}`, {
        method: "DELETE"
    });
}

// ==========================
// ROTAS
// ==========================

async function buscarRotas() {
    return request("/rotas");
}

async function buscarRotasPorVendedor(vendedorId) {

    return request(
        `/rotas?vendedor_id=${vendedorId}`
    );
}

async function criarRota(rota) {

    return request("/rotas", {
        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(rota)
    });
}

async function atualizarRota(id, rota) {

    return request(`/rotas/${id}`, {
        method: "PUT",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(rota)
    });
}

async function excluirRotaApi(id) {

    return request(`/rotas/${id}`, {
        method: "DELETE"
    });
}

// ==========================
// FALTAS
// ==========================

async function buscarFaltas() {
    return request("/faltas");
}

async function buscarFaltaPorId(id) {
    return request(`/faltas/${id}`);
}

async function buscarFaltasPorVendedor(vendedorId) {

    return request(
        `/faltas?vendedor_id=${vendedorId}`
    );
}

async function criarFalta(falta) {

    return request("/faltas", {
        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(falta)
    });
}

async function atualizarFalta(id, falta) {

    return request(`/faltas/${id}`, {
        method: "PUT",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(falta)
    });
}

async function excluirFaltaApi(id) {

    return request(`/faltas/${id}`, {
        method: "DELETE"
    });
}