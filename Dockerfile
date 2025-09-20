# Etapa 1: Instalar dependências e buildar a aplicação
FROM node:18-alpine AS builder

# Diretório de trabalho dentro do container
WORKDIR /app

# Copiar os arquivos de definição de dependências
COPY package.json package-lock.json* ./
COPY tsconfig.json* next.config.js* ./

# Instalar dependências
RUN npm install

# Copiar restante do código-fonte
COPY . .

# Gerar build da aplicação
RUN npm run build

# Etapa 2: Rodar a aplicação com um servidor leve (como o Next recomenda)
FROM node:18-alpine AS runner

# Diretório de trabalho
WORKDIR /app

# NODE_ENV para produção
ENV NODE_ENV=production

# Copiar os arquivos necessários da etapa de build
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Expõe a porta usada pela aplicação
EXPOSE 3000

# Comando para rodar a aplicação Next.js
CMD ["npm", "start"]
