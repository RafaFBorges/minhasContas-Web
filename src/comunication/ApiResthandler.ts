// O navegador só fala com o próprio site: as chamadas vão para /api (route handlers do Next), que guardam os tokens em cookies
// HttpOnly e repassam à API. A URL da API existe só no servidor (API_URL)
const SERVER_PATH = '/api/'

export const EXPENSES_ENDPOINT = 'expense'
export const CATEGORIES_ENDPOINT = 'category'
export const USER_ENDPOINT = 'user'
export const REGISTER_ENDPOINT = 'register'
export const LOGIN_ENDPOINT = 'auth/login'
export const LOGOUT_ENDPOINT = 'auth/logout'
export const SESSION_ENDPOINT = 'auth/session'

// Disparado quando uma chamada de dados volta 401 mesmo depois da renovação automática: a sessão acabou
export const SESSION_EXPIRED_EVENT = 'minhascontas:session-expired'

interface ErrorResponse {
  status: number;
  data: unknown;
}

function logSendMessage(sender: string, data: unknown) {
  let logMessage = `${sender} : [request send]`
  if (!data)
    logMessage += 'empty data'
  else if (Array.isArray(data))
    logMessage += 'Count=' + data.length
  else if (typeof data === "object")
    logMessage += 'ObjectKeysCount=' + Object.keys(data).length
  else
    logMessage += 'Unexpected response type'

  console.log(logMessage)
}

const request = async<T>(
  endpoint: string,
  method: string,
  body: unknown | string | null | undefined,
): Promise<T> => {
  let processedBody: string | undefined = undefined;

  if (body !== undefined && body !== null)
    processedBody = typeof body === "string"
      ? body
      : JSON.stringify(body)

  const response: Response = await fetch(SERVER_PATH + endpoint, {
    method,
    headers: { "Content-Type": "application/json" },
    body: processedBody,
    credentials: 'same-origin',
    cache: 'no-store',
  })

  // Os endpoints de autenticação (login, sessão, logout) tratam o próprio 401
  if (response.status === 401 && !endpoint.startsWith('auth/') && typeof window !== 'undefined')
    window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT))

  const responseText = await response.text()

  // Resposta que não é JSON (ex.: erro de proxy) não pode esconder o status HTTP.
  // Já numa resposta de sucesso, um corpo que não é JSON é erro de verdade e sobe para quem chamou
  let responseData: T | null = null
  let parseError: unknown = null
  if (responseText)
    try {
      responseData = JSON.parse(responseText) as T
    } catch (err) {
      parseError = err
    }

  if (!response.ok)
    throw { status: response.status, data: responseData } as ErrorResponse

  if (parseError)
    throw parseError

  return responseData as T
}

export async function handleGET<T = unknown>(endpoint: string): Promise<T> {
  try {
    console.log("handleGET : [start] endpoint=" + SERVER_PATH + endpoint)

    const data: T = await request<T>(endpoint, 'GET', null)

    logSendMessage("handleGET", data)

    return data
  } catch (err) {
    console.error("handleGET : [Error]", err)
    throw err
  }
}

export async function handlePOST<T = unknown>(endpoint: string, body: object): Promise<T> {
  try {
    console.log("handlePOST : [start] endpoint=" + SERVER_PATH + endpoint)

    const data: T = await request<T>(endpoint, 'POST', body)

    logSendMessage("handlePOST", data)

    return data
  } catch (err) {
    console.error("handlePOST : [Error]", err)
    throw err
  }
}

export async function handleDELETE(endpoint: string): Promise<boolean> {
  try {
    await request<void>(endpoint, 'DELETE', null)

    return true
  } catch (err) {
    const error = err as ErrorResponse
    if (error.status === 204)
      return true

    console.error("handleDELETE : [Error]", error)
    return false
  }
}

export async function handlePUT<T = unknown>(endpoint: string, body: object): Promise<T> {
  try {
    console.log("handlePUT : [start] endpoint=" + SERVER_PATH + endpoint)

    const data: T = await request<T>(endpoint, 'PUT', body)

    logSendMessage("handlePUT", data)

    return data
  } catch (err) {
    console.error("handlePUT : [Error]", err)
    throw err
  }
}
