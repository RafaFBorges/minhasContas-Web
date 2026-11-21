import type { NextRequest, NextResponse } from 'next/server'
import { USER_COOKIE_KEY } from '../../utils/DataConstants'
import { apiBase } from './apiConfig'

// Sessão do navegador, toda em cookies HttpOnly (o JavaScript da página nunca vê os tokens):
//  - ACCESS_COOKIE: access token (JWT, ~15 min). Some sozinho ao vencer, e então o /api renova com o refresh token.
//  - REFRESH_COOKIE: refresh token (7 dias, uso único, rotativo). Só vale para as rotas /api.
//  - USER_COOKIE_KEY: dados de exibição (id, nome, usuário, papel) e o fim da sessão. Não é segredo; existe para o middleware
//    saber se há sessão ao abrir /home (por isso fica em path "/", ao contrário dos tokens).
export const ACCESS_COOKIE = 'mc_at'
export const REFRESH_COOKIE = 'mc_rt'
const API_COOKIE_PATH = '/api'

const UPSTREAM_TIMEOUT_MS = 15_000

export interface ApiTokens {
  accessToken: string
  expiresAt: string
  refreshToken: string
  refreshExpiresAt: string
  id: number
  user: string
  name: string
  role: string
}

export interface Profile {
  id: number
  name: string
  user: string
  role: string
  sessionExpiresAt: string
}

export function profileOf(tokens: ApiTokens): Profile {
  return { id: tokens.id, name: tokens.name, user: tokens.user, role: tokens.role, sessionExpiresAt: tokens.refreshExpiresAt }
}

function isTokens(value: unknown): value is ApiTokens {
  if (value == null || typeof value !== 'object')
    return false

  const v = value as Record<string, unknown>

  return typeof v.accessToken === 'string' && v.accessToken !== '' &&
    typeof v.refreshToken === 'string' && v.refreshToken !== '' &&
    typeof v.expiresAt === 'string' && !isNaN(Date.parse(v.expiresAt)) &&
    typeof v.refreshExpiresAt === 'string' && !isNaN(Date.parse(v.refreshExpiresAt)) &&
    typeof v.id === 'number' && typeof v.user === 'string' && typeof v.name === 'string' && typeof v.role === 'string'
}

function secondsUntil(iso: string): number {
  return Math.max(1, Math.floor((Date.parse(iso) - Date.now()) / 1000))
}

function cookieOptions(path: string, maxAge: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path,
    maxAge,
  }
}

export function applySession(response: NextResponse, tokens: ApiTokens): void {
  response.cookies.set(ACCESS_COOKIE, tokens.accessToken, cookieOptions(API_COOKIE_PATH, secondsUntil(tokens.expiresAt)))
  response.cookies.set(REFRESH_COOKIE, tokens.refreshToken, cookieOptions(API_COOKIE_PATH, secondsUntil(tokens.refreshExpiresAt)))
  // O Next já codifica o valor ao gravar e decodifica ao ler: codificar aqui de novo quebraria nomes com "%"
  response.cookies.set(USER_COOKIE_KEY, JSON.stringify(profileOf(tokens)), cookieOptions('/', secondsUntil(tokens.refreshExpiresAt)))
}

export function clearSession(response: NextResponse): void {
  response.cookies.set(ACCESS_COOKIE, '', cookieOptions(API_COOKIE_PATH, 0))
  response.cookies.set(REFRESH_COOKIE, '', cookieOptions(API_COOKIE_PATH, 0))
  response.cookies.set(USER_COOKIE_KEY, '', cookieOptions('/', 0))
}

export function readTokens(request: NextRequest): { access?: string, refresh?: string } {
  return {
    access: request.cookies.get(ACCESS_COOKIE)?.value || undefined,
    refresh: request.cookies.get(REFRESH_COOKIE)?.value || undefined,
  }
}

export function readProfile(request: NextRequest): Profile | null {
  const raw = request.cookies.get(USER_COOKIE_KEY)?.value
  if (!raw)
    return null

  try {
    const p = JSON.parse(raw) as Partial<Profile>
    if (typeof p.id === 'number' && typeof p.name === 'string' && typeof p.user === 'string' && typeof p.role === 'string' &&
      typeof p.sessionExpiresAt === 'string' && Date.parse(p.sessionExpiresAt) > Date.now())
      return p as Profile
  } catch {
    // cookie corrompido ou de uma versão antiga: tratado como sem sessão
  }

  return null
}

export interface UpstreamResponse {
  status: number
  body: string
  contentType: string | null
  retryAfter: string | null
}

// Chamada à API. Nunca segue redirecionamento (um 3xx não pode levar o token para outro endereço) e nunca repassa o que o
// navegador mandou além do que é montado aqui. Rede fora do ar ou lenta vira null
export async function callApi(path: string, method: string, body: string | undefined, accessToken?: string): Promise<UpstreamResponse | null> {
  const headers: Record<string, string> = { Accept: 'application/json' }
  if (body !== undefined)
    headers['Content-Type'] = 'application/json'
  if (accessToken)
    headers['Authorization'] = 'Bearer ' + accessToken

  let base: string
  try {
    base = apiBase()
  } catch (err) {
    // API_URL ausente ou insegura: a mensagem é nossa (não leva segredo) e precisa aparecer no log, senão vira só "502"
    console.error('callApi : [Config] ' + (err instanceof Error ? err.message : 'invalid API_URL'))
    return null
  }

  try {
    const response = await fetch(base + path, {
      method,
      headers,
      body,
      redirect: 'manual',
      cache: 'no-store',
      signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
    })

    return {
      status: response.status,
      body: await response.text(),
      contentType: response.headers.get('content-type'),
      retryAfter: response.headers.get('retry-after'),
    }
  } catch (err) {
    console.error('callApi : [Error] path=' + path + ' error=' + (err instanceof Error ? err.name : 'unknown'))
    return null
  }
}

export type RefreshResult =
  | { kind: 'ok', tokens: ApiTokens }
  // A API recusou o refresh token (vencido, já usado, sessão encerrada): a sessão acabou
  | { kind: 'denied' }
  // Rede, 5xx, 429...: não dá para saber; a sessão NÃO deve ser apagada por causa disso
  | { kind: 'unavailable' }

// Vários pedidos simultâneos com o mesmo refresh token (a página abre e dispara 3 chamadas ao mesmo tempo) fazem UMA troca só.
// O resultado fica guardado por alguns segundos para quem chegar logo depois com o mesmo cookie antigo
const inflight = new Map<string, Promise<RefreshResult>>()
const RESULT_KEEP_MS = 5_000

async function exchange(refreshToken: string): Promise<RefreshResult> {
  const response = await callApi('refresh', 'POST', JSON.stringify({ refreshToken }))
  if (response == null)
    return { kind: 'unavailable' }

  if (response.status === 401 || response.status === 400)
    return { kind: 'denied' }

  if (response.status !== 200)
    return { kind: 'unavailable' }

  try {
    const parsed: unknown = JSON.parse(response.body)
    if (isTokens(parsed))
      return { kind: 'ok', tokens: parsed }
  } catch {
    // cai no unavailable abaixo
  }

  return { kind: 'unavailable' }
}

export function refreshSession(refreshToken: string): Promise<RefreshResult> {
  let pending = inflight.get(refreshToken)
  if (!pending) {
    pending = exchange(refreshToken)
    inflight.set(refreshToken, pending)

    const timer = setTimeout(() => inflight.delete(refreshToken), RESULT_KEEP_MS)
    timer.unref?.()
    // Só o sucesso fica guardado: uma falha passageira não pode travar as próximas tentativas
    pending.then(result => {
      if (result.kind !== 'ok')
        inflight.delete(refreshToken)
    })
  }

  return pending
}

export function parseTokens(body: string): ApiTokens | null {
  try {
    const parsed: unknown = JSON.parse(body)

    return isTokens(parsed) ? parsed : null
  } catch {
    return null
  }
}
