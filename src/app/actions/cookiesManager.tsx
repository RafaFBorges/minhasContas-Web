"use server"

import { cookies } from "next/headers"
import { TAG_DISABLED_KEY } from "../../../utils/DataConstants"

export interface ExpenseDisabledDictionary {
  [key: string]: '0' | '1';
}

export async function saveCookie(key: string, value: string) {
  const cookieStore = await cookies()

  const cleanKey = key.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  console.log('cookiesManager.saveCookie > key=' + cleanKey + '(' + key + ') value=' + value + ' normalized=' + (key != cleanKey))
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
  const stored = cookieStore.get(cleanKey)?.value

  console.log('cookiesManager.getCookie > key=' + cleanKey + '(' + key + ') value=' + stored + ' normalized=' + (key != cleanKey))
  return stored
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

export async function saveObjectCookie<T>(key: string, value: T, saveEmpty: boolean = false) {
  try {
    if (value == null && !saveEmpty) {
      console.log('cookiesManager.saveObjectCookie >  [Empty value] key=' + key)
      return
    }

    const data = JSON.stringify(value)
    await saveCookie(key, encodeURIComponent(data))

    console.log('cookiesManager.saveObjectCookie > key=' + key + ' hasData=' + (value != undefined))
  } catch (error) {
    console.error("cookiesManager.saveObjectCookie > [Couldnt convert Object to string] error=", error)
  }
}

export async function getObjectCookie<T>(key: string): Promise<T | null> {
  try {
    const cookie = await getCookie(key)

    console.log('cookiesManager.getObjectCookie > key=' + key + ' hasCookie=' + (cookie != null && cookie != undefined))
    if (cookie != null && cookie != undefined && cookie != '' && cookie != 'null' && cookie != 'undefined')
      return JSON.parse(decodeURIComponent(cookie)) as T
  } catch (error) {
    console.error("cookiesManager.getObjectCookie > [Couldnt convert string to Object] error=", error)
  }

  return null
}
