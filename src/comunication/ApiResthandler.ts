import { encrypt, decrypt } from '../../utils/crypto'

const SERVER_PATH = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/'

export const EXPENSES_ENDPOINT = 'expense'
export const CATEGORIES_ENDPOINT = 'category'
export const USER_ENDPOINT = 'user'
export const LOGIN_ENDPOINT = 'login'

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

function logSendMessage(sender: string, data: any) {
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
  body: any | string | null | undefined,
): Promise<T> => {
  let processedBody: string | undefined = undefined;

  if (body !== undefined && body !== null) {
    const plainText = typeof body === "string"
      ? body
      : JSON.stringify(body)

    processedBody = await encrypt(plainText)
  }

  const response: Response = await fetch(SERVER_PATH + endpoint, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: processedBody,
  })

  const responseText = await response.text()

  let responseData: T | null = null
  if (responseText) {
    const decrypted = await decrypt(responseText)
    responseData = JSON.parse(decrypted) as T
  }

  if (!response.ok)
    throw { status: response.status, data: responseData } as ErrorResponse

  return responseData as T
}

export async function handleGET(endpoint: string, token?: string) {
  try {
    console.log("handleGET : [start] endpoint=" + SERVER_PATH + endpoint)

    const data: any = await request(endpoint, 'GET', getHeaders(token), null)

    logSendMessage("handleGET", data)

    return data
  } catch (err) {
    console.error("handleGET : [Error]", err)
    throw err
  }
}

export async function handlePOST(endpoint: string, body: object, token?: string) {
  try {
    console.log("handlePOST : [start] endpoint=" + SERVER_PATH + endpoint)

    const data: any = await request(endpoint, 'POST', getHeaders(token), body)

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

export async function handlePUT(endpoint: string, body: object, token?: string) {
  try {
    console.log("handlePUT : [start] endpoint=" + SERVER_PATH + endpoint)

    const data: any = await request(endpoint, 'PUT', getHeaders(token), body)

    logSendMessage("handlePUT", data)

    return data
  } catch (err) {
    console.error("handlePUT : [Error]", err)
    throw err
  }
}
