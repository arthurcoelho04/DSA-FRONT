export const resources = ['produtos', 'vendedores', 'rotas', 'faltas'];
export const today = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; };
export const dateLabel = value => value ? value.slice(0,10).split('-').reverse().join('/') : '—';
export const number = value => Number(value || 0).toLocaleString('pt-BR');
export const normalize = value => String(value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
export const labels = { produtos: 'Produtos', vendedores: 'Vendedores', rotas: 'Rotas', faltas: 'Faltas' };
export const singular = { produtos: 'produto', vendedores: 'vendedor', rotas: 'rota', faltas: 'falta' };
export const emptyForm = type => type === 'faltas' ? { vendedor_id:'', produto_id:'', quantidade_falta:'', data:today() } : type === 'rotas' ? { vendedor_id:'', cidade:'', bairro:'' } : type === 'produtos' ? { nome:'', quantidade_total_carro:'' } : { nome:'' };
export function payload(type, form) {
  const result = {};
  for (const key of Object.keys(emptyForm(type))) {
    const value = form[key];
    if (value === '' || value == null || (typeof value === 'string' && !value.trim())) throw new Error('Preencha todos os campos obrigatórios.');
    if (key.endsWith('_id') || key.startsWith('quantidade_')) {
      const n = Number(value);
      if (!Number.isSafeInteger(n) || n < (key === 'quantidade_total_carro' ? 0 : 1)) throw new Error('Informe quantidades inteiras e identificadores válidos.');
      result[key] = n;
    } else if (key === 'data') {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || Number.isNaN(Date.parse(value))) throw new Error('Informe uma data válida.');
      result.data = `${value}T00:00:00Z`;
    } else result[key] = value.trim();
  }
  return result;
}
export function filterRows(type, rows, query, filters) {
  return rows.filter(row => normalize(type === 'faltas' ? `${row.vendedor?.nome} ${row.produto?.nome}` : type === 'rotas' ? `${row.cidade} ${row.bairro} ${row.vendedor?.nome}` : row.nome).includes(normalize(query))
    && (!filters.vendedor || String(row.vendedor_id) === filters.vendedor)
    && (!filters.produto || String(row.produto_id) === filters.produto)
    && (!filters.from || row.data?.slice(0,10) >= filters.from)
    && (!filters.to || row.data?.slice(0,10) <= filters.to));
}
