const API_URL = (import.meta.env?.VITE_API_URL || '/api').replace(/\/$/, '');
export async function request(endpoint, method = 'GET', data, signal) {
 let response;
 try { response = await fetch(`${API_URL}/${endpoint}`, { method, signal: signal || AbortSignal.timeout(15000), ...(data !== undefined && {headers:{'Content-Type':'application/json'},body:JSON.stringify(data)}) }); }
 catch (error) { if (error.name === 'AbortError') throw error; throw new Error('Não foi possível conectar ao serviço. Verifique sua conexão e tente novamente.'); }
 const body = await response.text();
 if (!response.ok) { let message = body; try { const parsed = JSON.parse(body); message = parsed.message || parsed.error || body; } catch {} throw new Error(message.trim() || `Não foi possível concluir a operação (${response.status}).`); }
 if (!body.trim()) return null;
 try { return JSON.parse(body); } catch { throw new Error('O serviço retornou uma resposta inválida.'); }
}
