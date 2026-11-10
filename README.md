DSA Gestão | Controle de Faltas
Sistema web de gestão comercial e controle de faltas de produtos, desenvolvido com React e Vite. A aplicação reúne cadastros de produtos, vendedores e rotas, além do registro e acompanhamento de faltas, em uma interface responsiva com indicadores operacionais.

Este repositório contém o frontend. A persistência de dados e as regras de negócio são fornecidas por uma API independente, desenvolvida em Go.
Funcionalidades
- Dashboard: total de produtos, vendedores e rotas; unidades em falta; gráfico dos últimos sete dias; ranking dos produtos com mais faltas; e registros recentes.
- Produtos: cadastro, consulta, edição e exclusão, com controle da quantidade total no carro.
- Vendedores: gerenciamento dos vendedores cadastrados e visualização da quantidade de rotas associadas.
- Rotas: cadastro de cidade, bairro e vendedor responsável.
- Faltas: registro de produto, vendedor, quantidade e data, com visualização da quantidade total no carro.
- Gestão de registros: pesquisa, filtros, ordenação, paginação de dez itens e confirmação antes de excluir.
- Experiência de uso: navegação por React Router, interface responsiva, mensagens de erro e sucesso e estados de carregamento.
Os indicadores são calculados com base nos dados recebidos da API, não em informações fictícias.
Tecnologias
Tecnologia	Finalidade
React 19	Interface e componentes reutilizáveis
React Router 7	Navegação entre páginas
Vite 7	Servidor de desenvolvimento e build
JavaScript (JSX)	Lógica do frontend
CSS	Estilização e responsividade
Fetch API	Comunicação HTTP com o backend
Node.js Test Runner	Testes automatizados


Pré-requisitos
- Node.js 22.12 ou superior e npm.
- Backend goDSA em execução, por padrão em http://localhost:8080.
- Banco de dados do backend configurado e disponível (conforme as instruções do projeto Go).
Como executar localmente
1. Instale as dependências
No terminal, dentro da pasta do frontend:
npm ci
2. Configure as variáveis de ambiente
Copie o arquivo .env.example para .env:
VITE_API_URL=/api
API_PROXY_TARGET=http://localhost:8080
- VITE_API_URL: prefixo utilizado pelo frontend nas chamadas HTTP.
- API_PROXY_TARGET: destino do proxy local do Vite, apontando para o backend Go.
O proxy encaminha /api/produtos, por exemplo, para http://localhost:8080/produtos, sem exigir alterações de CORS no backend durante o desenvolvimento.
3. Inicie o backend
Em outro terminal, inicie o projeto Go de acordo com sua estrutura e mantenha o serviço e o banco de dados ativos. O frontend não inicia o backend automaticamente.
4. Inicie o frontend
npm run dev
Abra a URL exibida pelo Vite no terminal, normalmente http://localhost:5173.
Rotas da aplicação
Endereço	Página
/	Dashboard / Visão geral
/produtos	Produtos
/vendedores	Vendedores
/rotas	Rotas
/faltas	Faltas


Os endereços antigos como /produtos.html e /faltas.html possuem redirecionamentos para as rotas correspondentes no React Router.
Estrutura do frontend
goFrontDSA/
├── index.html                # Entrada única da aplicação
├── .env.example              # Exemplo de configuração
├── package.json              # Dependências e comandos
├── vite.config.js            # Vite e proxy da API
├── src/
│   ├── main.jsx              # Inicialização do React
│   ├── App.jsx               # Layout principal e rotas
│   ├── components/           # Ícones e componentes de interface
│   ├── hooks/                # Carregamento e atualização de dados
│   ├── lib/                  # Regras da interface e navegação
│   ├── pages/                # Dashboard e gerenciamento de registros
│   ├── services/             # Cliente HTTP da API
│   └── styles/               # Estilos globais e responsivos
└── tests/                    # Testes automatizados
Integração com a API Go
O frontend consome os seguintes recursos, conforme o contrato atual da API:
Recurso	Operações
/produtos	Listar e cadastrar
/vendedores	Listar e cadastrar
/rotas	Listar e cadastrar
/faltas	Listar e cadastrar
/{recurso}/{id}	Consultar por ID, atualizar e excluir


Os recursos de rotas e faltas também aceitam o parâmetro ?vendedor_id=. A interface combina filtros locais sobre os dados carregados.

Principais campos enviados nos cadastros:
- Produto: nome, quantidade_total_carro.
- Vendedor: nome.
- Rota: cidade, bairro, vendedor_id.
- Falta: vendedor_id, produto_id, quantidade_falta, data.
A data é enviada em formato RFC 3339. A quantidade total associada à falta é calculada pelo backend conforme as regras existentes. O frontend não modifica a API Go nem o banco de dados.
Comandos disponíveis
npm run dev       # Inicia o servidor de desenvolvimento
npm test          # Executa os testes automatizados
npm run build     # Gera os arquivos de produção em dist/
npm run preview   # Visualiza localmente o build
Os testes cobrem aspectos da comunicação com a API, validações de dados e navegação. Para verificar a integração completa, mantenha o backend e o banco de dados em execução e teste os fluxos no navegador.
Publicação
Execute npm run build e publique os arquivos gerados em dist/.

Na hospedagem, configure:
1. Fallback de SPA: as rotas da interface (como /produtos) devem servir index.html quando não corresponderem a arquivos reais.
2. Encaminhamento da API: requisições para /api/* devem chegar ao backend Go com o prefixo /api removido, como no proxy local; alternativamente, configure VITE_API_URL com uma origem que o backend permita acessar.
3. Serviços independentes: mantenha o backend e o banco de dados configurados separadamente.
Atenção: variáveis VITE_* são incorporadas ao frontend e podem ser vistas no navegador. Não armazene senhas ou segredos nelas.

Observações
- Este projeto não implementa autenticação, pois não há contrato de login na API atual.
- A paginação e os filtros são feitos no frontend sobre as coleções carregadas; para grandes volumes de dados, seria necessário suporte adicional no servidor.
- A pasta dist/ é gerada automaticamente e não deve ser editada manualmente.
- O backend Go permanece independente e não precisa ser modificado para executar o frontend no ambiente de desenvolvimento com o proxy configurado.
DSA Gestão — organização de produtos, equipes, rotas e faltas em um só lugar.
