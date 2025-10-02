const SERVER_PATH = 'https://minhascontas-server.onrender.com/'

export const EXPENSES_ENDPOINT = 'expense'

export async function handleGET(endpoint: string) {
  try {
    console.log("handleGET : [start] endpoint=" + SERVER_PATH + endpoint)

    const response = await fetch(SERVER_PATH + endpoint, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
    })

    if (!response.ok)
      throw new Error("Erro HTTP: " + response.status)

    const data = await response.json()

    let logMessage = "handleGET : [request send]"
    if (!data)
      logMessage += 'empty data'
    else if (Array.isArray(data))
      logMessage += 'Count=' + data.length
    else if (typeof data === "object")
      logMessage += 'ObjectKeysCount=' + Object.keys(data).length
    else
      logMessage += 'Unexpected response type'
    console.log(logMessage)

    return data
  } catch (err) {
    return Response.json({ error: "Falha ao buscar dados" }, { status: 500 })
  }
}

export async function handlePOST(endpoint: string, body: object) {
  try {
    console.log("handlePOST : [start] endpoint=" + SERVER_PATH + endpoint)

    const response = await fetch(SERVER_PATH + endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body)
    })

    if (!response.ok)
      throw new Error("Erro HTTP: " + response.status)

    const data = await response.json()

    let logMessage = "handlePOST : [request send]"
    if (!data)
      logMessage += 'empty data'
    else if (Array.isArray(data))
      logMessage += 'Count=' + data.length
    else if (typeof data === "object")
      logMessage += 'ObjectKeysCount=' + Object.keys(data).length
    else
      logMessage += 'Unexpected response type'
    console.log(logMessage)

    return data
  } catch (err) {
    return Response.json({ error: "Erro ao processar" }, { status: 400 });
  }
}

export async function handleDELETE(endpoint: string) {
  try {
    console.log("handleDELETE : [start] endpoint=" + SERVER_PATH + endpoint)

    const response = await fetch(SERVER_PATH + endpoint, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      }
    })

    console.log('handleDELETE : status=' + response.status)

    if (!response.ok)
      throw new Error("Erro HTTP: " + response.status)

    return response.status == 204
  } catch (err) {
    return false
  }
}

export async function handlePUT(endpoint: string, body: object) {
  try {
    console.log("handlePUT : [start] endpoint=" + SERVER_PATH + endpoint)

    const response = await fetch(SERVER_PATH + endpoint, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body)
    })

    if (!response.ok)
      throw new Error("Erro HTTP: " + response.status)

    const data = await response.json()

    let logMessage = "handlePUT : [request send]"
    if (!data)
      logMessage += 'empty data'
    else if (Array.isArray(data))
      logMessage += 'Count=' + data.length
    else if (typeof data === "object")
      logMessage += 'ObjectKeysCount=' + Object.keys(data).length
    else
      logMessage += 'Unexpected response type'
    console.log(logMessage)

    return data
  } catch (err) {
    return Response.json({ error: "Erro ao processar" }, { status: 400 });
  }
}
