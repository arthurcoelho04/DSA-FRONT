import { Component, useEffect, useState } from 'react';
import { Link, NavLink, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { legacyRedirects, navigation, pagePath } from './lib/navigation.js';
import Icon from './components/Icon.jsx';
import { Button } from './components/ui.jsx';
import useData from './hooks/useData.js';
import { labels } from './lib/domain.js';
import Dashboard from './pages/Dashboard.jsx';
import Records from './pages/Records.jsx';
const pages = Object.fromEntries(navigation.map(({ id, label }) => [id, label]));
class ErrorBoundary extends Component {
 state={failed:false};
 static getDerivedStateFromError(){return {failed:true};}
 render(){return this.state.failed?<div className="fatal"><h1>Não foi possível exibir a página.</h1><p>Recarregue para tentar novamente.</p><Button onClick={()=>location.reload()}>Recarregar</Button></div>:this.props.children;}
}
function Application() {
 const location = useLocation();
 const routerNavigate = useNavigate();
 const page = navigation.find(item => item.path === location.pathname.replace(/\/$/, '') || item.path === location.pathname)?.id;
 const title = pages[page] || 'Página não encontrada'; const [mobile,setMobile]=useState(false); const [toast,setToast]=useState('');
 const {data,errors,loading,reload}=useData();
 function navigate(next){routerNavigate(pagePath(next));}
 useEffect(()=>{document.title=`${title} · DSA Gestão`;setMobile(false);window.scrollTo({top:0});document.getElementById('main')?.focus();},[location.pathname,title]);
 useEffect(()=>{if(!toast)return;const timer=setTimeout(()=>setToast(''),5000);return()=>clearTimeout(timer);},[toast]);
 return <><a className="skip-link" href="#main">Pular para o conteúdo</a>{mobile&&<button className="sidebar-backdrop" aria-label="Fechar navegação" onClick={()=>setMobile(false)}/>}
 <aside className={`sidebar ${mobile?'open':''}`}><Link className="brand" to="/"><span className="brand-mark"><Icon name="produtos" size={27}/></span><strong>DSA<span>Gestão comercial</span></strong></Link><div className="nav-label">PRINCIPAL</div><nav aria-label="Navegação principal">{navigation.map(({id,path,label})=><NavLink key={id} to={path} end className={({isActive})=>isActive?'active':''}><Icon name={id}/>{label}{page===id&&<i/>}</NavLink>)}</nav><div className="sidebar-note"><span className="note-icon"><Icon name="check"/></span><strong>Sua operação, conectada.</strong><p>Informações organizadas para o dia a dia da sua equipe.</p></div><div className="sidebar-footer"><span className="brand-dot"/>DSA · Controle de faltas <small>v2.0</small></div></aside>
 <div className="workspace"><header className="topbar"><div className="breadcrumb"><button className="icon-button mobile-menu" aria-label="Abrir navegação" aria-expanded={mobile} onClick={()=>setMobile(!mobile)}><Icon name="menu"/></button><span>Workspace</span><span>/</span><strong>{title}</strong></div><div className="topbar-right"><span className="date">{new Date().toLocaleDateString('pt-BR',{day:'numeric',month:'long',year:'numeric'})}</span><span className="workspace-badge">DSA</span></div></header>
 <main id="main" tabIndex="-1"><div className="page-heading"><div><span className="eyebrow">DSA / GESTÃO COMERCIAL</span><h1>{title}</h1></div><span className={`connection ${Object.keys(errors).length?'offline':''}`}><i/>{loading?'Atualizando dados':Object.keys(errors).length?'Conexão com pendências':'Dados sincronizados'}</span></div>
 {Object.keys(errors).length>0&&<div className="error" role="alert"><div><strong>Alguns dados não puderam ser atualizados.</strong><p>{Object.keys(errors).map(k=>labels[k]).join(', ')}: verifique se o serviço está disponível. Os dados anteriores podem estar desatualizados.</p></div><Button variant="secondary" disabled={loading} onClick={reload}>Tentar novamente</Button></div>}
 <Routes>
  <Route path="/" element={loading?<div className="loading" role="status"><span className="spinner"/>Carregando visão geral…</div>:<Dashboard data={data} navigate={navigate} unavailable={Object.keys(errors).length>0}/>}/>
  {navigation.filter(item=>item.id!=='dashboard').map(({id,path})=><Route key={id} path={path} element={<Records key={id} type={id} data={data} errors={errors} loading={loading} reload={reload} notify={setToast} navigate={navigate}/>}/>)}
  {legacyRedirects.map(({from,to})=><Route key={from} path={from} element={<Navigate to={{pathname:to,search:location.search,hash:location.hash}} replace/>}/>)}
  <Route path="*" element={<section className="empty"><h2>Página não encontrada</h2><p>O endereço informado não existe.</p><Link className="button" to="/">Voltar à visão geral</Link></section>}/>
 </Routes>
 <footer className="main-footer"><span>DSA Gestão</span><span>Organização que move sua operação.</span></footer></main></div>
 {toast&&<div className="toast" role="status"><Icon name="check"/>{toast}<button className="icon-button" aria-label="Fechar mensagem" onClick={()=>setToast('')}><Icon name="close" size={16}/></button></div>}</>;
}
export default function App(){return <ErrorBoundary><Application/></ErrorBoundary>;}
