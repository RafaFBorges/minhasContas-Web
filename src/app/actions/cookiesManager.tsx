"use server"

import { cookies } from "next/headers"

export async function saveCookie(key: string, value: string) {
  console.log('cookiesManager.saveCookie > key=' + key + ' value=' + value)
  
  const cookieStore = await cookies()
  
  console.log('cookiesManager.saveCookie > key=' + key + ' value=' + value)
  
  cookieStore.set({
    name: key,
    value,
    path: "/",
    maxAge: 60 * 60 * 24 * 365, // 1 ano
  })
}

export default async function getCookie(key: string): Promise<string | undefined> {
  const cookieStore = await cookies()
  const stored = cookieStore.get(key)?.value

  console.log('cookiesManager.getCookie > key=' + key + ' value=' + stored)
  return stored
}
