const paths = {
 dashboard:'M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h7v7h-7z',
 produtos:'m12 3 9 5-9 5-9-5 9-5z M3 8v9l9 5 9-5V8 M12 13v9 M7 5l9 5',
 vendedores:'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8 M20 21v-2a4 4 0 0 0-3-4 M16 3a4 4 0 0 1 0 8',
 rotas:'M5 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4 M19 21a2 2 0 1 0 0-4 2 2 0 0 0 0 4 M7 5h8a4 4 0 0 1 0 8H9a4 4 0 0 0 0 8h8',
 faltas:'M7 3h10v4H7z M7 5H4v17h16V5h-3 M8 12h8 M8 17h5',
 search:'m21 21-5-5 M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16',
 plus:'M12 5v14 M5 12h14', close:'m6 6 12 12 M6 18 18 6', arrow:'M5 12h14 m-5-5 5 5-5 5',
 refresh:'M20 7v5h-5 M4 17v-5h5 M6 6a8 8 0 0 1 13 3 M18 18a8 8 0 0 1-13-3', menu:'M4 6h16 M4 12h16 M4 18h16',
 edit:'m16 3 5 5-12 12-6 1 1-6L16 3z', trash:'M3 6h18 M9 6V3h6v3 M5 6l1 15h12l1-15 M10 10v7 M14 10v7', check:'m5 12 4 4L19 6',
};
export default function Icon({ name, size=20 }) { return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[name] || paths.dashboard}/></svg>; }
