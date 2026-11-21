"use server"

import { cookies } from "next/headers"
import { FILTER_SELECTION_KEY, LANG_KEY, TAG_DISABLED_KEY, THEME_KEY } from "../../../utils/DataConstants"

export interface ExpenseDisabledDictionary {
  [key: string]: '0' | '1';
}

// Estas funções são Server Actions: qualquer código da página (inclusive um script injetado) consegue chamá-las. Por isso só
// os cookies de preferência abaixo podem ser lidos ou gravados. Os cookies da sessão (tokens) são HttpOnly e só os route
// handlers de /api tocam neles
const ALLOWED_COOKIES = new Set([THEME_KEY, LANG_KEY, TAG_DISABLED_KEY, FILTER_SELECTION_KEY]
  .map(key => key.normalize("NFD").replace(/[\u0300-\u036f]/g, "")))

function requireAllowed(cleanKey: string) {
  if (!ALLOWED_COOKIES.has(cleanKey))
    throw new Error('Cookie not allowed: ' + cleanKey)
}

export async function saveCookie(key: string, value: string) {
  const cookieStore = await cookies()

  const cleanKey = key.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  requireAllowed(cleanKey)
  console.log('cookiesManager.saveCookie > key=' + cleanKey + ' normalized=' + (key != cleanKey))
  cookieStore.set({
    name: cleanKey,
    value,
    path: "/",
    maxAge: 60 * 60 * 24 * 365, // 1 ano
  })
}

export default async function getCookie(key: string): Promise<string | undefined> {
  const cookieStore = await cookies()
  const cleanKey = key.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  requireAllowed(cleanKey)
  const stored = cookieStore.get(cleanKey)?.value

  console.log('cookiesManager.getCookie > key=' + cleanKey + ' found=' + (stored != null) + ' normalized=' + (key != cleanKey))
  return stored
}

// As preferências de filtro pertencem a quem estava logado: no logout elas somem, para a próxima conta no mesmo navegador
// não herdar. Tema e idioma são do aparelho e ficam
export async function clearUserPreferences() {
  const cookieStore = await cookies()

  for (const key of [TAG_DISABLED_KEY, FILTER_SELECTION_KEY])
    cookieStore.delete(key.normalize("NFD").replace(/[\u0300-\u036f]/g, ""))
}

export async function saveExpenseDisabledCookie(key: string, value: boolean) {
  try {
    const cleanKey = key.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    const cookieObject: ExpenseDisabledDictionary = await getExpenseDisabledCookie()
    if (cookieObject == null)
      return

    cookieObject[cleanKey] = value ? '0' : '1'

    await saveCookie(TAG_DISABLED_KEY, encodeURIComponent(JSON.stringify(cookieObject)))
  } catch (error) {
    console.error("cookiesManager.saveExpenseDisabledCookie > [Couldnt convert string to Object] error=", error);
  }
}

export async function getExpenseDisabledCookie(): Promise<ExpenseDisabledDictionary> {
  const cookie = await getCookie(TAG_DISABLED_KEY)

  try {
    if (cookie != null && cookie != '')
      return JSON.parse(decodeURIComponent(cookie)) as ExpenseDisabledDictionary
  } catch (error) {
    console.error("cookiesManager.getExpenseDisabledCookie > [Couldnt convert string to Object] error=", error);
  }

  return {} as ExpenseDisabledDictionary
}
