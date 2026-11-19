import { openPassword } from '@rafafborges/componentes'
import { LOGIN_ENDPOINT, LOGOUT_ENDPOINT, SESSION_ENDPOINT, handlePOST } from './ApiResthandler'

export interface LoginRequest {
  user: string;
  password: string;
}

// Dados de exibição da sessão. Os tokens não chegam aqui: ficam em cookies HttpOnly, que só o servidor do Next lê
export interface LoginSession {
  id: number;
  name: string;
  user: string;
  role: string;
  sessionExpiresAt: string;
}

export const RequestLogin = async (user: string, password: string, onError: () => void = () => { }): Promise<LoginSession | null> => {
  if (user == '' || password == '')
    return null

  try {
    // A senha chega como token do cofre (veja passwordVault.ts) e só é aberta aqui, na hora de enviar
    const request: LoginRequest = {
      user: user,
      password: await openPassword(password)
    }

    return await handlePOST<LoginSession>(LOGIN_ENDPOINT, request)
  } catch (error) {
    // Só o status vai para o log: o objeto de erro pode trazer o corpo da resposta
    console.log('RequestLogin > error status=' + (error as { status?: number })?.status)

    if (onError != null)
      onError()

    return null
  }
}

// Sessão que o servidor já tem para este navegador (null = não logado)
export const RequestSession = async (): Promise<LoginSession | null> => {
  try {
    // fetch direto: quem nunca logou recebe 401 aqui, e isso não é erro (não pode sujar o console nem derrubar a sessão)
    const response = await fetch('/api/' + SESSION_ENDPOINT, { credentials: 'same-origin', cache: 'no-store' })

    return response.ok ? await response.json() as LoginSession : null
  } catch {
    return null
  }
}

export const RequestLogout = async (): Promise<void> => {
  try {
    await handlePOST(LOGOUT_ENDPOINT, {})
  } catch (error) {
    console.error('RequestLogout > [Error]', (error as { status?: number })?.status)
  }
}
