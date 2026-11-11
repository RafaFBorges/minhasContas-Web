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
  - Back-end REST API: comunicação via `ApiResthandler` para login, despesas, categorias e tags.

<div id="arquitetura-pastas"/>
<h3> Arquitetura</h3>

  - root
    - `components` : componentes visuais reutilizáveis.
    - `src/app` : páginas e layout do Next.js.
    - `src/comunication` : camadas de requisição à API.
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
   NEXT_PUBLIC_API_URL=http://localhost:8080/
   ```

<h5> Variáveis disponíveis: </h5>

- `NEXT_PUBLIC_API_URL`: URL da API REST do servidor back-end (sem a variável, `npm run dev` usa `http://localhost:8080/`)
  - Nota: O prefixo `NEXT_PUBLIC_` torna a variável acessível no cliente Next.js, ou seja, o **navegador** é quem chama a API. Por isso a URL precisa ser alcançável de fora (um nome interno de rede Docker, como `http://backend:8080`, não funciona).
  - **Em produção precisa ser `https://`.** A senha vai em texto no corpo da requisição e só o TLS a protege. O valor é gravado no bundle durante o `npm run build`, e o build de produção **falha** se a variável estiver ausente, com espaços em volta, inválida ou sem `https://`.
- `ALLOW_INSECURE_API_URL`: com valor `1`, o build de produção aceita uma URL `http://` (só para testar um build local com a API em HTTP). **Nunca use no deploy.**

<h5> Build e deploy: </h5>

- **Local:** `npm run build` lê o `.env.local`. Se a API local estiver em HTTP, rode `ALLOW_INSECURE_API_URL=1 npm run build`.
- **Docker:** a URL entra como argumento de build, porque é gravada no bundle (o `.env.local` não vai para a imagem):
  ```bash
  docker build --build-arg NEXT_PUBLIC_API_URL=https://api.exemplo.com/ .
  ```
- **Render:** cadastre `NEXT_PUBLIC_API_URL` (com `https://`) nas variáveis de ambiente do serviço do Web. Sem ela, o próximo deploy falha no build; é o comportamento esperado. Se o serviço usar Docker, a variável precisa chegar como build arg.
- **GitHub Actions (CI):** o passo de build lê a variável `NEXT_PUBLIC_API_URL` de *Settings → Secrets and variables → Actions → Variables*. Use o mesmo valor do deploy; sem ela o CI falha.
