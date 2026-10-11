function criarLayout(paginaAtual = "") {
    document.body.insertAdjacentHTML(
        "afterbegin",
        `
        <aside class="sidebar">

            <div class="sidebar-logo">
                <div class="logo-icone">▣</div>

                <div>
                    <strong>Controle de Faltas</strong>
                </div>
            </div>

            <nav class="sidebar-menu">

                <a href="index.html"
                   class="menu-item ${paginaAtual === "inicio" ? "ativo" : ""}">
                    <span class="menu-icone">⌂</span>
                    <span>Início</span>
                </a>

                <a href="faltas.html"
                   class="menu-item ${paginaAtual === "faltas" ? "ativo" : ""}">
                    <span class="menu-icone">▤</span>
                    <span>Faltas</span>
                </a>

                <a href="produtos.html"
                   class="menu-item ${paginaAtual === "produtos" ? "ativo" : ""}">
                    <span class="menu-icone">◇</span>
                    <span>Produtos</span>
                </a>

                <a href="vendedores.html"
                   class="menu-item ${paginaAtual === "vendedores" ? "ativo" : ""}">
                    <span class="menu-icone">♟</span>
                    <span>Vendedores</span>
                </a>

            </nav>

            <div class="sidebar-rodape">
                <span>Sistema DSA</span>
            </div>

        </aside>

        <header class="topbar">

            <div class="topbar-pesquisa">
                <span>⌕</span>

                <input
                    type="text"
                    placeholder="Pesquisar..."
                    aria-label="Pesquisar"
                >
            </div>

            <div class="topbar-usuario">

                <div class="avatar">
                    AD
                </div>

                <div class="usuario-info">
                    <strong>Admin</strong>
                    <span>Administrador</span>
                </div>

            </div>

        </header>
        `
    );
}