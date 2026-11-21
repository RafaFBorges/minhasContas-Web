import type { NextConfig } from "next";
import { PHASE_PRODUCTION_BUILD } from "next/constants";

// O navegador não chama a API: quem chama é o /api do próprio Next, no servidor, com a URL de API_URL (lida em tempo de execução,
// nunca vai para o bundle). Como a senha e os tokens passam por essa chamada, em produção ela só pode ser HTTPS. O build confere
// a variável para uma configuração errada falhar aqui, e não só no primeiro login (a mesma regra é aplicada de novo em
// src/server/apiConfig.ts quando o servidor sobe).
//
// Para testar um build de produção na sua máquina com uma API em HTTP, use ALLOW_INSECURE_API_URL=1
// (nunca no deploy)
function assertSecureApiUrl() {
  if (process.env.NEXT_PUBLIC_API_URL)
    console.warn("[next.config] NEXT_PUBLIC_API_URL não é mais usada. Use API_URL (variável só do servidor).")

  const url = process.env.API_URL

  if (!url)
    throw new Error("API_URL não está definida. Defina a URL https:// da API antes do build de produção.")

  if (url !== url.trim())
    throw new Error("API_URL tem espaços no início ou no fim. Remova-os.")

  if (process.env.ALLOW_INSECURE_API_URL === "1") {
    console.warn(`[next.config] ALLOW_INSECURE_API_URL=1: aceitando API_URL=${url} sem exigir https://. Não use isto no deploy.`)
    return
  }

  let protocol: string
  try {
    protocol = new URL(url).protocol
  } catch {
    throw new Error(`API_URL (${url}) não é uma URL válida. Use algo como https://api.exemplo.com/`)
  }

  if (protocol !== "https:")
    throw new Error(`API_URL (${url}) precisa usar https:// no build de produção. Para testar localmente com HTTP, defina ALLOW_INSECURE_API_URL=1.`)
}

const nextConfig = (phase: string): NextConfig => {
  if (phase === PHASE_PRODUCTION_BUILD)
    assertSecureApiUrl()

  return {
    /* config options here */
  }
}

export default nextConfig;
