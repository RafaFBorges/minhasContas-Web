# Etapa 1: Instalar dependências e buildar a aplicação
FROM node:18-alpine AS builder

# Diretório de trabalho dentro do container
WORKDIR /app

# Copiar os arquivos de definição de dependências
COPY package.json package-lock.json* ./

# Instalar dependências
RUN npm install

# Copiar restante do código-fonte
COPY . .

# URL da API. O servidor do Next a lê em tempo de execução (docker run -e API_URL=https://...); aqui ela só serve para o build
# conferir se é https://. Em produção precisa ser https://
# Uso: docker build --build-arg API_URL=https://api.exemplo.com/ .
ARG API_URL
# Só para testar o build de produção local com a API em HTTP. Nunca no deploy
ARG ALLOW_INSECURE_API_URL

RUN test -n "$API_URL" || (echo "ERRO: informe --build-arg API_URL=https://..." >&2; exit 1)

ENV API_URL=$API_URL
ENV ALLOW_INSECURE_API_URL=$ALLOW_INSECURE_API_URL

# Gerar build da aplicação
RUN npm run build

# Etapa 2: Rodar a aplicação com um servidor leve (como o Next recomenda)
FROM node:18-alpine AS runner

# Diretório de trabalho
WORKDIR /app

# NODE_ENV para produção
ENV NODE_ENV=production

# Em tempo de execução a API_URL precisa estar no ambiente do container (docker run -e API_URL=https://api.exemplo.com/)

# Copiar os arquivos necessários da etapa de build
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Expõe a porta usada pela aplicação
EXPOSE 3000

# Comando para rodar a aplicação Next.js
CMD ["npm", "start"]
