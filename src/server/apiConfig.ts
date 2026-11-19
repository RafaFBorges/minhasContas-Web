// URL da API, lida só no servidor (API_URL, sem NEXT_PUBLIC_): o navegador nunca chama a API, quem chama é o /api do Next.
// Fica no ambiente de execução, não no bundle.
//
// Em produção a URL precisa ser https:// (os tokens e a senha trafegam nessa chamada). Para testar um build de produção local
// com a API em HTTP, use ALLOW_INSECURE_API_URL=1 (nunca no deploy)
const DEV_DEFAULT = 'http://localhost:8080/'

let cached: string | null = null

export function parseApiBase(raw: string | undefined, production: boolean, allowInsecure: boolean): string {
  const value = (raw ?? '').trim() || (production ? '' : DEV_DEFAULT)
  if (!value)
    throw new Error('API_URL não está definida. Defina a URL https:// da API.')

  let url: URL
  try {
    url = new URL(value)
  } catch {
    throw new Error('API_URL não é uma URL válida. Use algo como https://api.exemplo.com/')
  }

  if (url.protocol !== 'https:' && url.protocol !== 'http:')
    throw new Error('API_URL precisa usar http:// ou https://')
  if (production && url.protocol !== 'https:' && !allowInsecure)
    throw new Error('API_URL precisa usar https:// em produção. Para testar localmente com HTTP, defina ALLOW_INSECURE_API_URL=1.')

  // Sempre termina em "/" para os caminhos serem concatenados sem emendar o último segmento
  return url.origin + url.pathname.replace(/\/?$/, '/')
}

export function apiBase(): string {
  if (cached == null)
    cached = parseApiBase(process.env.API_URL, process.env.NODE_ENV === 'production', process.env.ALLOW_INSECURE_API_URL === '1')

  return cached
}
