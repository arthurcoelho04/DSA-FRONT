import { useState } from 'react';
import { request } from '../services/api.js';
import { dateLabel, emptyForm, filterRows, labels, number, payload, singular } from '../lib/domain.js';
import { Button, Empty, Field, Modal } from '../components/ui.jsx';
import Icon from '../components/Icon.jsx';
const headings = {produtos:['Produto','Quantidade no carro'], vendedores:['Vendedor','Rotas de atendimento'], rotas:['Cidade','Bairro','Vendedor'], faltas:['Data','Vendedor','Produto','Em falta','Total no carro']};
export default function Records({ type, data, loading, errors, reload, notify, navigate }) {
 const [query,setQuery]=useState(''); const [filters,setFilters]=useState({}); const [page,setPage]=useState(1);
 const [sort,setSort]=useState('recent'); const [editor,setEditor]=useState(null); const [form,setForm]=useState({}); const [deletion,setDeletion]=useState(null); const [busy,setBusy]=useState(false); const [error,setError]=useState('');
 const rows=filterRows(type,data[type],query,filters).sort((a,b)=>sort==='name'?String(a.nome||a.cidade||a.data).localeCompare(String(b.nome||b.cidade||b.data),'pt-BR'):b.id-a.id);
 const pages=Math.max(1,Math.ceil(rows.length/10)); const current=Math.min(page,pages); const visible=rows.slice((current-1)*10,current*10);
 const unavailable=Boolean(errors[type]);
 const dependencies=type==='faltas'?['produtos','vendedores']:type==='rotas'?['vendedores']:[];
 const disabled=loading||busy||unavailable||dependencies.some(k=>errors[k]);
 function open(item) { setForm(item?{...item,data:item.data?.slice(0,10)}:emptyForm(type)); setEditor(item?.id??'new'); setError(''); }
 const change=key=>event=>setForm(previous=>({...previous,[key]:event.target.value}));
 function filter(key,value) { setFilters(previous=>({...previous,[key]:value})); setPage(1); }
 async function save(event) {
  event.preventDefault(); setBusy(true); setError('');
  try {
   const body=payload(type,form);
   if(type==='faltas' && !data.produtos.some(p=>p.id===body.produto_id && p.quantidade_total_carro>0)) throw new Error('O produto precisa ter quantidade no carro maior que zero para registrar faltas.');
   await request(editor==='new'?type:`${type}/${editor}`,editor==='new'?'POST':'PUT',body);
   setEditor(null); notify('Registro salvo com sucesso.'); await reload();
  } catch(e) {setError(e.message);} finally {setBusy(false);}
 }
 async function remove() { setBusy(true); setError(''); try { await request(`${type}/${deletion.id}`,'DELETE'); setDeletion(null); notify('Registro excluído com sucesso.'); await reload(); } catch(e){setError(e.message);} finally{setBusy(false);} }
 const product=data.produtos.find(p=>String(p.id)===String(form.produto_id));
 return <>
  <div className="section-intro"><div><span className="eyebrow">GESTÃO DA OPERAÇÃO</span><h2>{labels[type]}</h2><p>{{produtos:'Organize seu catálogo e as quantidades de cada produto no carro.',vendedores:'Gerencie sua equipe e acompanhe as rotas de cada vendedor.',rotas:'Organize cidades, bairros e responsáveis pelo atendimento.',faltas:'Registre e acompanhe as faltas de produtos por vendedor.'}[type]}</p></div><Button icon="plus" disabled={disabled} onClick={()=>open()}>Adicionar {singular[type]}</Button></div>
  {type==='faltas' && (!data.produtos.length||!data.vendedores.length) && !loading && !disabled && <div className="notice">Para registrar faltas, cadastre primeiro produtos e vendedores.</div>}
  <section className="panel"><div className="panel-heading"><div><h2>{labels[type]} cadastrados <span className="count">{unavailable?'—':data[type].length}</span></h2><p>Consulte e mantenha seus registros atualizados.</p></div><Button variant="secondary" icon="refresh" disabled={loading||busy} onClick={reload}>Atualizar</Button></div>
   <div className="filters"><label className="search"><Icon name="search" size={18}/><input type="search" aria-label={`Pesquisar ${labels[type]}`} placeholder={type==='rotas'?'Buscar cidade, bairro ou vendedor…':type==='faltas'?'Buscar produto ou vendedor…':'Pesquisar por nome…'} value={query} onChange={e=>{setQuery(e.target.value);setPage(1);}}/></label>
   {(type==='faltas'||type==='rotas')&&<select aria-label="Filtrar por vendedor" value={filters.vendedor||''} onChange={e=>filter('vendedor',e.target.value)}><option value="">Todos os vendedores</option>{data.vendedores.map(v=><option key={v.id} value={v.id}>{v.nome}</option>)}</select>}
   {type==='faltas'&&<><select aria-label="Filtrar por produto" value={filters.produto||''} onChange={e=>filter('produto',e.target.value)}><option value="">Todos os produtos</option>{data.produtos.map(p=><option key={p.id} value={p.id}>{p.nome}</option>)}</select><Field label="De" type="date" value={filters.from||''} onChange={e=>filter('from',e.target.value)}/><Field label="Até" type="date" min={filters.from} value={filters.to||''} onChange={e=>filter('to',e.target.value)}/></>}
   <select aria-label="Ordenar registros" value={sort} onChange={e=>{setSort(e.target.value);setPage(1);}}><option value="recent">Mais recentes</option><option value="name">Ordem crescente</option></select>
   {(query||Object.values(filters).some(Boolean))&&<button className="text-button" onClick={()=>{setQuery('');setFilters({});setPage(1);}}>Limpar filtros</button>}</div>
   {loading ? <div className="loading" role="status"><span className="spinner"/>Carregando registros…</div> : unavailable ? <Empty title="Não foi possível carregar os registros" description="Use Atualizar para tentar novamente."/> : !rows.length ? <Empty/> : <div className="table-wrap"><table><thead><tr>{headings[type].map(h=><th key={h} scope="col">{h}</th>)}<th className="actions" scope="col">Ações</th></tr></thead><tbody>{visible.map(item=><tr key={item.id}>
    {type==='produtos'&&<><td className="primary-cell"><span className="cell-icon"><Icon name="produtos" size={17}/></span>{item.nome}<small>#{String(item.id).padStart(4,'0')}</small></td><td><span className={`badge ${item.quantidade_total_carro?'':'warning'}`}>{number(item.quantidade_total_carro)} unidades</span></td></>}
    {type==='vendedores'&&<><td className="primary-cell"><span className="person-avatar">{item.nome?.slice(0,2).toUpperCase()}</span>{item.nome}</td><td><button className="text-button" onClick={()=>navigate('rotas')}>{errors.rotas?'Indisponível':`${data.rotas.filter(r=>r.vendedor_id===item.id).length} rotas`} <Icon name="arrow" size={14}/></button></td></>}
    {type==='rotas'&&<><td className="primary-cell">{item.cidade}</td><td>{item.bairro}</td><td>{data.vendedores.find(v=>v.id===item.vendedor_id)?.nome||item.vendedor?.nome||'Vendedor removido'}</td></>}
    {type==='faltas'&&<><td>{dateLabel(item.data)}</td><td>{item.vendedor?.nome||'Vendedor removido'}</td><td className="primary-cell">{item.produto?.nome||'Produto removido'}</td><td><span className="badge warning">{number(item.quantidade_falta)} un.</span></td><td>{number(item.quantidade_total)} un.</td></>}
    <td><div className="row-actions"><button className="icon-button" title="Editar registro" aria-label={`Editar registro ${item.id}`} disabled={disabled} onClick={()=>open(item)}><Icon name="edit" size={17}/></button><button className="icon-button danger" title="Excluir registro" aria-label={`Excluir registro ${item.id}`} disabled={disabled} onClick={()=>{setDeletion(item);setError('');}}><Icon name="trash" size={17}/></button></div></td></tr>)}</tbody></table></div>}
   <footer className="pagination"><span>{unavailable?'Dados indisponíveis':`${number(rows.length)} registros encontrados`}</span><div><Button variant="secondary" disabled={current===1||loading} onClick={()=>setPage(current-1)}>Anterior</Button><span>{current} de {pages}</span><Button variant="secondary" disabled={current===pages||loading} onClick={()=>setPage(current+1)}>Próxima</Button></div></footer>
  </section>
  {editor!==null&&<Modal title={`${editor==='new'?'Adicionar':'Editar'} ${singular[type]}`} busy={busy} onClose={()=>setEditor(null)}><form onSubmit={save}><div className="modal-body"><p className="muted">Preencha os dados abaixo. Campos com * são obrigatórios.</p>{error&&<div className="error" role="alert">{error}</div>}<div className="form-grid">
   {(type==='produtos'||type==='vendedores')&&<Field label="Nome" required maxLength={180} autoFocus value={form.nome||''} onChange={change('nome')}/>}
   {type==='produtos'&&<Field label="Quantidade total no carro" type="number" required min="0" step="1" value={form.quantidade_total_carro??''} onChange={change('quantidade_total_carro')}/>}
   {(type==='rotas'||type==='faltas')&&<Field label="Vendedor" required options={data.vendedores} value={form.vendedor_id||''} onChange={change('vendedor_id')}/>}
   {type==='rotas'&&<><Field label="Cidade" required maxLength={180} value={form.cidade||''} onChange={change('cidade')}/><Field label="Bairro" required maxLength={180} value={form.bairro||''} onChange={change('bairro')}/></>}
   {type==='faltas'&&<><Field label="Produto" required options={data.produtos} value={form.produto_id||''} onChange={change('produto_id')}/><Field label="Quantidade em falta" type="number" required min="1" step="1" value={form.quantidade_falta??''} onChange={change('quantidade_falta')}/><Field label="Quantidade no carro" readOnly value={product?.quantidade_total_carro??''} hint="Preenchida automaticamente pelo produto."/><Field label="Data do registro" type="date" required value={form.data||''} onChange={change('data')}/></>}
   </div></div><div className="modal-footer"><Button type="button" variant="secondary" disabled={busy} onClick={()=>setEditor(null)}>Cancelar</Button><Button disabled={busy} type="submit" icon="check">{busy?'Salvando…':'Salvar registro'}</Button></div></form></Modal>}
  {deletion&&<Modal title="Excluir registro?" busy={busy} onClose={()=>setDeletion(null)}><div className="modal-body"><p>Deseja excluir {deletion.nome||deletion.cidade||`o registro #${deletion.id}`}? Esta ação não pode ser desfeita.</p>{error&&<div className="error" role="alert">{error}</div>}</div><div className="modal-footer"><Button variant="secondary" disabled={busy} onClick={()=>setDeletion(null)}>Cancelar</Button><Button variant="destructive" disabled={busy} onClick={remove}>{busy?'Excluindo…':'Excluir registro'}</Button></div></Modal>}
 </>;
}
