<!-- Título -->
<h1 align="center"> Minhas Contas Web </h1>

<h6 align="right">editado pela última vez: 17/04/2026</h6>

*******
### Índice 

* [Descrição do Projeto](#descrição-do-projeto)
* [Status do Projeto](#status-do-projeto)
* [Pessoas Desenvolvedoras](#pessoas-desenvolvedoras)
* [Funcionalidades e Demonstração da Aplicação](#funcionalidades-e-demonstração-da-aplicação)
* [Modo de uso](#modo-de-uso)
* [Tecnologias utilizadas](#tecnologias-utilizadas)
* [Arquitetura](#arquitetura)
*******

<!-- Descrição -->
<h2> :blue_book: Sobre: </h2>

<div id="descrição-do-projeto"/>
<h3> Descrição </h3>

Minhas Contas Web é uma interface front-end construída em Next.js e TypeScript para gerenciamento de finanças pessoais. A aplicação fornece telas de autenticação, criação de despesas e organização por categorias e tags para apoiar o controle financeiro do usuário.

<div id="status-do-projeto"/>

> Status do Projeto: :construction: Projeto em construção :construction:
  - Criação *v0.1.0*: 15/04/2026

<div id="pessoas-desenvolvedoras"/>
<h3> Desenvolvedores </h3>

| [<img src="https://github.com/RafaFBorges.png" alt="foto do desenvolvedor" width="128px" height="128px"/><br><sub>Equipe Minhas Contas</sub>](https://github.com/RafaFBorges)
| :---: |

<!-- Funcionalidades e Demonstração da Aplicação -->
<div id="funcionalidades-e-demonstração-da-aplicação"/>
<h2> :hammer: Funcionalidades e Demonstração da Aplicação: </h2>

Minhas Contas Web *v0.1.0*.
  - Login com autenticação via API.
  - Exibição e cadastro de despesas com categorias e tags.
  - Interface modular construída com componentes e hooks reutilizáveis.
  - Suporte a temas e traduções de textos básicos.
  - Estrutura com Dockerfile para containerização.

### Releases:

- *v0.1.0*
  * :construction: Em construção :construction:

<!-- Primeiro acesso -->
<div id="modo-de-uso" />

### Modo de uso:

- Passos para instalar as tecnologias necessárias:

  1. Instale Node.js neste [link](https://nodejs.org/en/)
  2. Verifique se o Node está instalado com o seguinte código:
  ```bash
  node --version
  ```

- Construindo dependências do projeto (no root):

```bash
npm install
```

- Opções para rodar a aplicação:

  1. Dev: inicia o servidor de desenvolvimento com atualização automática.

    ```bash
    npm run dev
    ```

  2. Build: gera o build de produção.

    ```bash
    npm run build
    ```

  3. Start: inicia a aplicação em modo de produção após o build.

    ```bash
    npm run start
    ```

  4. Lint: valida o código com ESLint.

    ```bash
    npm run lint
    ```

- A aplicação será acessível em:

```bash
http://localhost:3000
```

<!-- Tecnologias -->
<div id="tecnologias-utilizadas"/>
<h2> Stack de tecnologias: </h2>

- Next.js
- React
- TypeScript
- ESLint
- react-icons
- tinycolor2

<!-- Arquitetura -->
<div id="arquitetura"/>
<h2> Arquitetura: </h2>

<div id="arquitetura-servicos"/>
<h3> Estrutura de Serviços </h3>

  - Front-end Next.js: UI da aplicação financeira.
  - Back-end REST API: o navegador **não** chama a API. `ApiResthandler` chama o próprio site em `/api/...`, e os route handlers do Next (`src/app/api`) repassam à API pelo servidor, com a URL em `API_URL`.
  - Sessão: os tokens (access de 15 min e refresh de 7 dias, rotativo) ficam só em cookies **HttpOnly**, que o JavaScript da página não consegue ler. O navegador recebe apenas dados de exibição (id, nome, usuário, papel).

<div id="arquitetura-pastas"/>
<h3> Arquitetura</h3>

  - root
    - `components` : componentes visuais reutilizáveis.
    - `src/app` : páginas e layout do Next.js.
    - `src/comunication` : requisições do navegador para `/api` (login, sessão, despesas, categorias).
    - `src/app/api` : BFF (proxy para a API): `auth/login`, `auth/logout`, `auth/session` e `[...path]` (despesas, categorias e cadastro).
    - `src/server` : código só do servidor: URL da API, cookies da sessão, renovação do token e checagem de origem.
    - `src/domain` : classes de domínio como `Expense`, `Category` e `Tag`.
    - `src/fragments` : fragmentos de UI específicos.
    - `src/modalPages` : configurações e validações de modais.
    - `utils` : utilitários de cores, hooks e constantes.
    - `public` : ativos públicos.

<div id="arquitetura-variaveis"/>
<h3> Variáveis de ambiente </h3>

  As variáveis de ambiente são configuradas no arquivo `.env.local`. Um arquivo `.env.example` está disponível como referência.

<h5> Como configurar: </h5>

1. Copie o arquivo `.env.example` para `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Edite o arquivo `.env.local` com seus valores. Para desenvolvimento local, a API costuma ficar em:
   ```bash
   API_URL=http://localhost:8080/
   ```

<h5> Variáveis disponíveis: </h5>

- `API_URL`: URL da API REST do back-end (sem a variável, `npm run dev` usa `http://localhost:8080/`).
  - **Só o servidor do Next lê esta variável** (não tem o prefixo `NEXT_PUBLIC_`): ela não vai para o bundle e não aparece no navegador. Por isso pode ser um endereço interno (ex.: `http://backend:8080` na rede do Docker) e pode ser trocada sem refazer o build.
  - **Em produção precisa ser `https://`.** A senha e os tokens passam por essa chamada. O build de produção **falha** se a variável estiver ausente, com espaços em volta, inválida ou sem `https://`, e o servidor repete a checagem ao subir.
- `ALLOW_INSECURE_API_URL`: com valor `1`, aceita uma URL `http://` em produção (só para testar um build local com a API em HTTP). **Nunca use no deploy.**
- A variável antiga `NEXT_PUBLIC_API_URL` **não é mais usada**; troque pelo nome `API_URL` no Render, no GitHub e no `.env.local`.

<h5> Build e deploy: </h5>

- **Local:** `npm run build` lê o `.env.local`. Se a API local estiver em HTTP, rode `ALLOW_INSECURE_API_URL=1 npm run build`.
- **Docker:** o build confere a URL e o container a lê ao rodar:
  ```bash
  docker build --build-arg API_URL=https://api.exemplo.com/ -t minhascontas-web .
  docker run -e API_URL=https://api.exemplo.com/ -p 3000:3000 minhascontas-web
  ```
- **Render:** cadastre `API_URL` (com `https://`) nas variáveis de ambiente do serviço do Web. Sem ela, o próximo deploy falha no build; é o comportamento esperado.
- **GitHub Actions (CI):** o passo de build lê a variável `API_URL` de *Settings → Secrets and variables → Actions → Variables*. Use o mesmo valor do deploy; sem ela o CI falha.

<h5> Sessão e segurança do /api: </h5>

- **Cookies:** `mc_at` (access) e `mc_rt` (refresh) são `HttpOnly`, `SameSite=Lax` e `Secure` em produção, com `Path=/api`. O cookie `UserKey` (dados de exibição, também `HttpOnly`) fica em `/` só para o middleware saber se há sessão em `/home`.
- **Renovação:** quando o access token vence, o `/api` renova com o refresh token sozinho e repete a chamada. Pedidos simultâneos fazem uma troca só. Se a API recusar o refresh, a sessão acaba (cookies apagados e volta para o login); se a API estiver fora do ar, a sessão é mantida e o `/api` responde 502.
- **CSRF:** além de `SameSite=Lax`, qualquer requisição que altere algo (POST, PUT, DELETE) precisa ter `Origin` igual ao do site; sem isso o `/api` responde 403.
- **Lista fechada:** o `/api` só repassa `expense`, `category` e `register`, com GET, POST, PUT e DELETE. Login, refresh e logout da API nunca são alcançáveis direto. Cabeçalhos de autorização enviados pelo navegador são ignorados.
- **Limites assumidos:** o logout encerra a sessão na API (o refresh token deixa de valer), mas o access token que já foi emitido continua válido até vencer (no máximo 15 min), porque a API não revoga access tokens. O bloqueio de login por tentativas é por usuário, na API; ainda não há limite por IP no Web.
