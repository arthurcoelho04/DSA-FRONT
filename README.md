# DSA — Frontend

Interface web desenvolvida em **React**, responsável pela interação do usuário com o sistema DSA, permitindo o gerenciamento de produtos, vendedores, rotas e o controle de faltas de produtos.

## Funcionalidades

- **Dashboard:** Painel de controle com indicadores e informações gerais do sistema.
- **Gerenciamento de Produtos:** Cadastro, consulta, edição e exclusão de produtos.
- **Gerenciamento de Vendedores:** Controle e administração dos vendedores cadastrados.
- **Gerenciamento de Rotas:** Cadastro, consulta e gerenciamento das rotas vinculadas aos vendedores.
- **Controle de Faltas:** Registro, consulta e acompanhamento das faltas de produtos.
- **Pesquisa e Filtros:** Ferramentas para facilitar a localização e organização dos registros.
- **Interface Responsiva:** Layout adaptado para diferentes tamanhos de tela.
- **Integração com API REST:** Comunicação com o backend desenvolvido em Go.

## Tecnologias Utilizadas

- **React:** Desenvolvimento da interface e dos componentes.
- **JavaScript (JSX):** Implementação da lógica e das funcionalidades.
- **Vite:** Ferramenta de desenvolvimento e build.
- **React Router:** Gerenciamento das rotas e navegação.
- **HTML5:** Estrutura da aplicação.
- **CSS3:** Estilização e responsividade.
- **API REST:** Integração com o backend.

## Estrutura do Projeto

- `src/components/` — Componentes reutilizáveis da interface.
- `src/pages/` — Páginas e funcionalidades do sistema.
- `src/services/` — Comunicação com a API REST.
- `src/styles/` — Arquivos de estilização.
- `src/App.jsx` — Componente principal da aplicação.
- `src/main.jsx` — Inicialização do React.
- `index.html` — Ponto de entrada da aplicação.
- `vite.config.js` — Configurações do Vite.

## Como Executar

1. Clone o repositório.
2. Instale as dependências com `npm install`.
3. Certifique-se de que o backend Go e o banco de dados PostgreSQL estejam em execução.
4. Inicie o frontend com `npm run dev`.
5. Acesse a aplicação pelo endereço exibido no terminal, normalmente `http://localhost:5173`.

## Backend

A API REST responsável pelo processamento e armazenamento dos dados é desenvolvida em **Go (Golang)**, utilizando GORM e PostgreSQL.

A aplicação frontend se comunica com essa API para realizar as operações do sistema.

## Objetivo do Projeto

Desenvolver uma aplicação web moderna, organizada e responsiva, facilitando o gerenciamento de produtos, vendedores, rotas e o acompanhamento de faltas, por meio da integração entre React e Go.
