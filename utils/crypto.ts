const SECRET_KEY = process.env.NEXT_PUBLIC_CRYPTO_SECRET_KEY
const IV = process.env.NEXT_PUBLIC_CRYPTO_IV

const getKeyAndIv = async (): Promise<{ key: CryptoKey; iv: ArrayBuffer }> => {
  const encoder = new TextEncoder()

  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(SECRET_KEY).buffer as ArrayBuffer,
    { name: "AES-CBC" },
    false,
    ["encrypt", "decrypt"]
  )

  return {
    key: keyMaterial,
    iv: encoder.encode(IV).buffer as ArrayBuffer,
  }
}

export const encrypt = async (plainText: string): Promise<string> => {
  const { key, iv } = await getKeyAndIv()
  const encoder = new TextEncoder()

  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-CBC", iv },
    key,
    encoder.encode(plainText).buffer as ArrayBuffer
  )

  return btoa(String.fromCharCode(...new Uint8Array(encrypted)))
}

export const decrypt = async (base64Text: string): Promise<string> => {
  const { key, iv } = await getKeyAndIv()

  const binaryStr = atob(base64Text)
  const bytes = new Uint8Array(binaryStr.length)
  for (let i = 0; i < binaryStr.length; i++)
    bytes[i] = binaryStr.charCodeAt(i)

  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-CBC", iv },
    key,
    bytes.buffer as ArrayBuffer
  )

  return new TextDecoder().decode(decrypted)
}
