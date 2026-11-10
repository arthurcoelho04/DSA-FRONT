import test from 'node:test';
import assert from 'node:assert/strict';
import { payload, filterRows, dateLabel } from '../src/lib/domain.js';
test('serializa somente campos permitidos e mantém o contrato de data do Go', () => {
 assert.deepEqual(payload('faltas', { vendedor_id:'2', produto_id:'3', quantidade_falta:'4', data:'2026-11-09', quantidade_total:999, produto:{} }), { vendedor_id:2, produto_id:3, quantidade_falta:4, data:'2026-11-09T00:00:00Z' });
 assert.deepEqual(payload('produtos', { nome:'  Café  ', quantidade_total_carro:'0', id:10 }), { nome:'Café', quantidade_total_carro:0 });
 assert.deepEqual(payload('rotas', {cidade:' Recife ',bairro:' Centro ',vendedor_id:'2'}), {cidade:'Recife',bairro:'Centro',vendedor_id:2});
});
test('rejeita dados vazios, números fracionários, negativos e IDs inválidos', () => {
 for (const value of ['', '-1', '1.5', 'abc', 'Infinity']) assert.throws(()=>payload('produtos',{nome:'Produto',quantidade_total_carro:value}));
 assert.throws(()=>payload('vendedores',{nome:'   '}));
 assert.throws(()=>payload('rotas',{cidade:'Recife',bairro:'Centro',vendedor_id:0}));
 assert.throws(()=>payload('faltas',{vendedor_id:1,produto_id:1,quantidade_falta:0,data:'2026-11-09'}));
});
test('combina busca sem acentos, vendedor, produto e período inclusivo', () => {
 const rows=[{id:1,vendedor_id:2,produto_id:3,vendedor:{nome:'João'},produto:{nome:'Café'},data:'2026-11-09T00:00:00Z'},{id:2,vendedor_id:4,produto_id:3,vendedor:{nome:'Maria'},produto:{nome:'Café'},data:'2026-11-08T00:00:00Z'}];
 assert.deepEqual(filterRows('faltas',rows,'cafe',{vendedor:'2',produto:'3',from:'2026-11-09',to:'2026-11-09'}).map(r=>r.id),[1]);
 assert.equal(filterRows('faltas',rows,'JOAO',{}).length,1);
 assert.equal(filterRows('faltas',rows,'',{from:'2026-11-10'}).length,0);
});
test('exibe data sem deslocamento de fuso',()=>assert.equal(dateLabel('2026-11-09T00:00:00Z'),'09/11/2026'));
