import test from 'node:test';
import assert from 'node:assert/strict';
import { matchRoutes, createMemoryRouter } from 'react-router-dom';
import { navigation, legacyRedirects, pagePath } from '../src/lib/navigation.js';

const routes = [
  ...navigation.map(page => ({ path: page.path, id: page.id })),
  ...legacyRedirects.map(({ from, to }) => ({ path: from, id: from, handle: { redirect: to } })),
  { path: '*', id: 'not-found' },
];

test('cada página tem uma rota única e aceita acesso direto', () => {
  assert.equal(new Set(navigation.map(page => page.path)).size, 5);
  for (const page of navigation) {
    assert.equal(pagePath(page.id), page.path);
    assert.equal(matchRoutes(routes, page.path)[0].route.id, page.id);
    assert.equal(matchRoutes(routes, `${page.path}?busca=cafe`)[0].route.id, page.id);
  }
  assert.equal(matchRoutes(routes, '/inexistente')[0].route.id, 'not-found');
  assert.throws(() => pagePath('inexistente'));
});

test('todos os endereços HTML antigos têm destino válido', () => {
  assert.deepEqual(legacyRedirects.map(item => item.from), ['/index.html', '/produtos.html', '/vendedores.html', '/rotas.html', '/faltas.html']);
  for (const { from, to } of legacyRedirects) {
    assert.equal(matchRoutes(routes, from)[0].route.handle.redirect, to);
    assert.notEqual(matchRoutes(routes, to)[0].route.id, 'not-found');
  }
});

test('histórico do router preserva voltar e avançar entre cadastros', async () => {
  const router = createMemoryRouter(routes, { initialEntries: ['/'] });
  try {
    await router.navigate('/produtos');
    await router.navigate('/faltas');
    await router.navigate(-1);
    assert.equal(router.state.location.pathname, '/produtos');
    await router.navigate(1);
    assert.equal(router.state.location.pathname, '/faltas');
  } finally { router.dispose(); }
});
