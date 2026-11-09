# DSA Gestão — frontend

Aplicação React 19 + Vite. Somente este frontend foi alterado; o projeto goDSA é consultado como referência do contrato HTTP.

## Executar

Requer Node.js 22.12+ e npm. Instale com `npm ci`, copie `.env.example` para `.env` e execute `npm run dev`. Inicie o backend e seu banco separadamente, conforme a configuração existente dele. O destino padrão da API é http://localhost:8080.

- `npm run dev`: desenvolvimento.
- `npm test`: testes de contratos, validações, filtros e tratamento de erros.
- `npm run build`: produção em `dist/`.
- `npm run preview`: inspeciona o build com o mesmo proxy da API.

O proxy `/api` de desenvolvimento/preview encaminha os endpoints existentes, contornando a restrição de origem do backend sem alterá-lo. `API_PROXY_TARGET` configura o destino. Em produção, configure o servidor web para encaminhar `/api/*` ao Go removendo `/api`, ou configure `VITE_API_URL` para uma origem já autorizada pelo backend. Variáveis VITE são públicas; não coloque segredos nelas.

## Organização

- `src/components`: componentes visuais, ícones SVG, campos, modais e indicadores.
- `src/pages`: dashboard e gestão dos quatro recursos.
- `src/hooks`: carregamento paralelo, cancelamento e erros por recurso.
- `src/lib`: validações, serialização de payloads, busca e formatação.
- `src/services`: cliente HTTP com limite de tempo e tratamento de respostas.
- `src/styles`: estilos globais, layout responsivo e estados dos componentes.
- `tests`: testes automatizados sem dependências adicionais.

O único HTML de entrada é `index.html`. O React Router gerencia `/`, `/produtos`, `/vendedores`, `/rotas` e `/faltas`, com navegação por links, histórico de voltar/avançar e página de endereço não encontrado. A configuração central fica em `src/lib/navigation.js`. Os endereços antigos `index.html`, `produtos.html`, `vendedores.html`, `rotas.html` e `faltas.html` redirecionam no React para as novas rotas, preservando query string e fragmento. Os quatro HTMLs redundantes foram removidos após migrar as referências da navegação e a configuração de múltiplas entradas do Vite. Não há autenticação no contrato atual; a interface não apresenta um login ou usuário fictício.

## Contrato preservado

Os recursos `/produtos`, `/vendedores`, `/rotas` e `/faltas` usam GET/POST na coleção e PUT/DELETE por `/:id`; o backend também disponibiliza GET por ID. Rotas e faltas aceitam consulta `?vendedor_id=`; a interface combina os filtros localmente sobre as coleções carregadas.

Produtos enviam `nome` e `quantidade_total_carro`; vendedores enviam `nome`; rotas enviam `cidade`, `bairro`, `vendedor_id`; faltas enviam `vendedor_id`, `produto_id`, `quantidade_falta`, `data` em RFC3339. A quantidade total da falta é calculada pelo backend a partir do produto. A interface impede registrar faltas de produto com quantidade total zero, como exige o serviço Go.

Dashboard e gráficos usam dados reais, com período explícito. Falhas parciais são exibidas e impedem alterações nos recursos afetados. Dados anteriores podem permanecer visíveis com aviso de desatualização. Exclusões exigem confirmação; falhas preservam os formulários. Pesquisa ignora acentos, filtros podem ser combinados, e as tabelas têm ordenação e paginação local de 10 registros.

## Implantação e limites

Publique apenas `dist/` com o encaminhamento da API configurado. O servidor web deve servir `index.html` para endereços da aplicação que não correspondam a arquivos, incluindo os antigos caminhos `.html` (fallback SPA). Isso permite acesso direto, atualização e novas abas nas rotas do React Router. O Vite já faz esse fallback no desenvolvimento e no preview. Mantenha `/api` separado desse fallback: as requisições da API continuam encaminhadas ao Go sem alterações no backend. `dist/` é gerado pelo build e ignorado pelo Git; não edite seus arquivos manualmente. Para volumes grandes, paginação e agregação no servidor serão necessárias, pois o contrato atual retorna as coleções completas. A tipografia externa é opcional e possui fallback local de sistema.

Os testes usam respostas simuladas e não escrevem no banco do backend. Testes Go existentes usam banco real e não são executados por este frontend. A validação em navegador e a integração com um backend ativo devem ser feitas no ambiente de execução antes da implantação.
