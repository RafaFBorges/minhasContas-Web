// Os endpoints são concatenados direto na URL base, então ela precisa terminar em "/"
// (sem isso, https://api.exemplo.com viraria https://api.exemplo.comexpense)
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/'
const SERVER_PATH = API_URL.endsWith('/') ? API_URL : API_URL + '/'

export const EXPENSES_ENDPOINT = 'expense'
export const CATEGORIES_ENDPOINT = 'category'
export const USER_ENDPOINT = 'user'
export const LOGIN_ENDPOINT = 'login'
export const REGISTER_ENDPOINT = 'register'

interface ErrorResponse {
  status: number;
  data: unknown;
}

function getHeaders(token?: string): Record<string, string> {
  const headers: Record<string, string> = {}
  if (token)
    headers["token"] = token

  return headers
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
  headers: Record<string, string> = {},
  body: unknown | string | null | undefined,
): Promise<T> => {
  let processedBody: string | undefined = undefined;

  if (body !== undefined && body !== null)
    processedBody = typeof body === "string"
      ? body
      : JSON.stringify(body)

  const response: Response = await fetch(SERVER_PATH + endpoint, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: processedBody,
  })

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

export async function handleGET<T = unknown>(endpoint: string, token?: string): Promise<T> {
  try {
    console.log("handleGET : [start] endpoint=" + SERVER_PATH + endpoint)

    const data: T = await request<T>(endpoint, 'GET', getHeaders(token), null)

    logSendMessage("handleGET", data)

    return data
  } catch (err) {
    console.error("handleGET : [Error]", err)
    throw err
  }
}

export async function handlePOST<T = unknown>(endpoint: string, body: object, token?: string): Promise<T> {
  try {
    console.log("handlePOST : [start] endpoint=" + SERVER_PATH + endpoint)

    const data: T = await request<T>(endpoint, 'POST', getHeaders(token), body)

    logSendMessage("handlePOST", data)

    return data
  } catch (err) {
    console.error("handlePOST : [Error]", err)
    throw err
  }
}

export async function handleDELETE(endpoint: string, token?: string): Promise<boolean> {
  try {
    await request<void>(endpoint, 'DELETE', getHeaders(token), null)

    return true
  } catch (err) {
    const error = err as ErrorResponse
    if (error.status === 204)
      return true

    console.error("handleDELETE : [Error]", error)
    return false
  }
}

export async function handlePUT<T = unknown>(endpoint: string, body: object, token?: string): Promise<T> {
  try {
    console.log("handlePUT : [start] endpoint=" + SERVER_PATH + endpoint)

    const data: T = await request<T>(endpoint, 'PUT', getHeaders(token), body)

    logSendMessage("handlePUT", data)

    return data
  } catch (err) {
    console.error("handlePUT : [Error]", err)
    throw err
  }
}
