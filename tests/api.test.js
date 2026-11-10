import test from 'node:test';
import assert from 'node:assert/strict';
import { request } from '../src/services/api.js';
test('cliente preserva métodos e payloads e aceita respostas vazias', async () => {
 const original=globalThis.fetch;
 try {
  globalThis.fetch=async(url,options)=>{assert.equal(url,'/api/rotas/12');assert.equal(options.method,'PUT');assert.equal(options.headers['Content-Type'],'application/json');assert.deepEqual(JSON.parse(options.body),{cidade:'Recife'});return new Response('{"id":12}');};
  assert.deepEqual(await request('rotas/12','PUT',{cidade:'Recife'}),{id:12});
  globalThis.fetch=async()=>new Response(null,{status:204});
  assert.equal(await request('rotas/12','DELETE'),null);
 } finally {globalThis.fetch=original;}
});
test('cliente apresenta erros de texto, JSON, conexão e resposta inválida', async()=>{
 const original=globalThis.fetch;
 try {
  globalThis.fetch=async()=>new Response('Produto não encontrado',{status:404}); await assert.rejects(request('produtos/1'),/Produto não encontrado/);
  globalThis.fetch=async()=>new Response('{"error":"Nome obrigatório"}',{status:400}); await assert.rejects(request('produtos'),/Nome obrigatório/);
  globalThis.fetch=async()=>{throw new TypeError('Failed to fetch');}; await assert.rejects(request('produtos'),/conectar ao serviço/);
  globalThis.fetch=async()=>new Response('<html>'); await assert.rejects(request('produtos'),/resposta inválida/);
 } finally {globalThis.fetch=original;}
});
