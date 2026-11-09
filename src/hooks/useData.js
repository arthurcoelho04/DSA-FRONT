import { useCallback, useEffect, useRef, useState } from 'react';
import { request } from '../services/api.js';
import { resources } from '../lib/domain.js';
export default function useData() {
  const [data, setData] = useState(Object.fromEntries(resources.map(key => [key, []])));
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const controller = useRef();
  const reload = useCallback(async () => {
    controller.current?.abort();
    const active = new AbortController(); controller.current = active;
    const timer = setTimeout(() => active.abort(new DOMException('Tempo esgotado', 'TimeoutError')), 15000);
    setLoading(true);
    const results = await Promise.allSettled(resources.map(key => request(key, 'GET', undefined, active.signal)));
    clearTimeout(timer);
    if (controller.current !== active) return;
    const failures = {};
    results.forEach((result, index) => {
      const key = resources[index];
      if (result.status === 'fulfilled' && (result.value === null || Array.isArray(result.value))) setData(previous => ({ ...previous, [key]: result.value || [] }));
      else failures[key] = result.reason?.message || 'Resposta inválida do serviço.';
    });
    setErrors(failures); setLoading(false);
    return Object.keys(failures).length === 0;
  }, []);
  useEffect(() => { reload(); return () => { controller.current?.abort(); controller.current = null; }; }, [reload]);
  return { data, errors, loading, reload };
}
