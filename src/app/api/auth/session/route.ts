import type { NextRequest } from 'next/server'

import { json } from '@/server/http'
import { clearSession, readProfile, readTokens } from '@/server/session'

export const dynamic = 'force-dynamic'

// Quem está logado, para a página ao abrir. Não chama a API: o refresh token presente e os dados de exibição ainda dentro do prazo
// bastam para a página montar a tela; a primeira chamada de dados valida (e renova) de verdade
export async function GET(request: NextRequest) {
  const profile = readProfile(request)
  const { refresh } = readTokens(request)

  if (profile == null || !refresh) {
    const response = json(401, { message: 'No session' })
    clearSession(response)

    return response
  }

  return json(200, profile)
}
