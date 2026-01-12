"use server"

import { cookies } from "next/headers"

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
