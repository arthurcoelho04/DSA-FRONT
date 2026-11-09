import { useEffect, useRef } from 'react';
import Icon from './Icon.jsx';
export function Button({ children, variant='', icon, ...props }) { return <button className={`button ${variant}`} {...props}>{icon && <Icon name={icon} size={17}/>} {children}</button>; }
export function Field({ label, options, hint, ...props }) { return <label className="field"><span>{label}{props.required && <b aria-hidden="true"> *</b>}</span>{options ? <select {...props}><option value="">Selecione...</option>{options.map(o => <option key={o.id} value={o.id}>{o.nome}</option>)}</select> : <input {...props}/>} {hint && <small>{hint}</small>}</label>; }
export function Empty({ title='Nenhum registro encontrado', description='Cadastre um registro ou ajuste os filtros para continuar.' }) { return <div className="empty"><span><Icon name="search" size={26}/></span><h3>{title}</h3><p>{description}</p></div>; }
export function Modal({ title, children, onClose, busy=false }) {
  const ref = useRef();
  useEffect(() => { const dialog = ref.current; const previous = document.activeElement; dialog.showModal(); return () => { dialog.close(); previous?.focus(); }; }, []);
  return <dialog ref={ref} onCancel={event => { event.preventDefault(); if (!busy) onClose(); }} aria-labelledby="modal-title"><div className="modal-head"><h2 id="modal-title">{title}</h2><button className="icon-button" aria-label="Fechar" disabled={busy} onClick={onClose}><Icon name="close"/></button></div>{children}</dialog>;
}
export function Stat({ label, value, detail, icon, tone='' }) { return <article className="stat"><div><span className="eyebrow">{label}</span><strong>{value}</strong><small>{detail}</small></div><span className={`stat-icon ${tone}`}><Icon name={icon} size={23}/></span></article>; }
