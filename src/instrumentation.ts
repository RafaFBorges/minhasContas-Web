// Roda uma vez quando o servidor sobe. Confere API_URL já aqui: um container iniciado com a variável errada falha na hora,
// e não só no primeiro login (que viraria um 502 sem causa visível). Durante o build a variável é conferida pelo next.config.ts
export async function register() {
  if (process.env.NEXT_RUNTIME !== 'nodejs' || process.env.NEXT_PHASE === 'phase-production-build')
    return

  const { apiBase } = await import('./server/apiConfig')
  apiBase()
}
