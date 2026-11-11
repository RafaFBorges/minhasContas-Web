import type { NextConfig } from "next";
import { PHASE_PRODUCTION_BUILD } from "next/constants";

// A senha vai em texto no corpo das requisições, então em produção a API só pode ser acessada por
// HTTPS. NEXT_PUBLIC_API_URL é gravada no bundle durante o build: se estiver ausente ou errada, o
// site publicado ficaria apontando para http://localhost:8080 ou para HTTP puro, sem nenhum aviso.
//
// Para testar um build de produção na sua máquina com uma API em HTTP, use ALLOW_INSECURE_API_URL=1
// (nunca no deploy)
function assertSecureApiUrl() {
  const url = process.env.NEXT_PUBLIC_API_URL

  if (!url)
    throw new Error("NEXT_PUBLIC_API_URL não está definida. Defina a URL https:// da API antes do build de produção.")

  // O valor é gravado no bundle exatamente como está, então espaços em volta não podem passar
  if (url !== url.trim())
    throw new Error("NEXT_PUBLIC_API_URL tem espaços no início ou no fim. Remova-os.")

  if (process.env.ALLOW_INSECURE_API_URL === "1") {
    console.warn(`[next.config] ALLOW_INSECURE_API_URL=1: aceitando NEXT_PUBLIC_API_URL=${url} sem exigir https://. Não use isto no deploy.`)
    return
  }

  let protocol: string
  try {
    protocol = new URL(url).protocol
  } catch {
    throw new Error(`NEXT_PUBLIC_API_URL (${url}) não é uma URL válida. Use algo como https://api.exemplo.com/`)
  }

  if (protocol !== "https:")
    throw new Error(`NEXT_PUBLIC_API_URL (${url}) precisa usar https:// no build de produção. Para testar localmente com HTTP, defina ALLOW_INSECURE_API_URL=1.`)
}

const nextConfig = (phase: string): NextConfig => {
  if (phase === PHASE_PRODUCTION_BUILD)
    assertSecureApiUrl()

  return {
    /* config options here */
  }
}

export default nextConfig;
