import { labels } from './domain.js';

export const navigation = [
  { id: 'dashboard', path: '/', label: 'Visão geral' },
  ...Object.entries(labels).map(([id, label]) => ({ id, path: `/${id}`, label })),
];

export const legacyRedirects = navigation.map(({ id, path }) => ({
  from: id === 'dashboard' ? '/index.html' : `/${id}.html`,
  to: path,
}));

export function pagePath(id) {
  const page = navigation.find(page => page.id === id);
  if (!page) throw new Error(`Página desconhecida: ${id}`);
  return page.path;
}
