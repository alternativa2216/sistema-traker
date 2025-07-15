# Tracklytics - Documentação Técnica

Bem-vindo à documentação técnica do Tracklytics. Este documento fornece uma visão geral da estrutura do projeto, das tecnologias utilizadas e de como executar a aplicação localmente.

## Tecnologias Utilizadas

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Linguagem:** [TypeScript](https://www.typescriptlang.org/)
- **Estilização:** [Tailwind CSS](https://tailwindcss.com/)
- **Componentes UI:** [shadcn/ui](https://ui.shadcn.com/)
- **Inteligência Artificial:** [Genkit (Firebase)](https://firebase.google.com/docs/genkit)
- **Banco de Dados:** [MySQL](https://www.mysql.com/) (com o driver `mysql2`)
- **Validação de Formulários:** [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)
- **Gráficos:** [Recharts](https://recharts.org/)

## Estrutura de Pastas

```
/
├── public/                 # Arquivos estáticos (imagens, fontes)
├── src/
│   ├── app/                # Rotas do Next.js (App Router)
│   │   ├── (auth)/         # Rotas de autenticação (login, registro)
│   │   ├── admin/          # Rotas e layout do painel de administração
│   │   ├── api/            # Rotas de API (ex: /api/track)
│   │   ├── dashboard/      # Rotas e layout do painel do usuário
│   │   ├── actions/        # Server Actions para interações com o backend
│   │   ├── globals.css     # Estilos globais e variáveis de tema
│   │   └── layout.tsx      # Layout raiz da aplicação
│   │
│   ├── components/         # Componentes React reutilizáveis
│   │   ├── admin/          # Componentes específicos do painel de admin
│   │   ├── dashboard/      # Componentes específicos do painel do usuário
│   │   ├── shared/         # Componentes compartilhados (ex: Logo)
│   │   └── ui/             # Componentes base do shadcn/ui
│   │
│   ├── ai/                 # Lógica de Inteligência Artificial com Genkit
│   │   ├── flows/          # Definição dos fluxos de IA
│   │   └── schemas.ts      # Schemas Zod para as entradas e saídas dos fluxos
│   │
│   ├── hooks/              # Hooks React customizados (ex: useToast)
│   │
│   ├── lib/                # Funções utilitárias e de bibliotecas
│   │   ├── db.ts           # Configuração da conexão com o banco de dados
│   │   └── utils.ts        # Funções utilitárias (ex: cn para classes)
│   │
│   └── middleware.ts       # Middleware para controle de rotas (autenticação)
│
├── .env                    # Arquivo de variáveis de ambiente (NÃO VERSIONAR)
├── next.config.js          # Configurações do Next.js
└── tailwind.config.ts      # Configurações do Tailwind CSS
```

## Configuração do Ambiente

1.  **Clone o repositório:**
    ```bash
    git clone <url_do_repositorio>
    cd <nome_do_projeto>
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

3.  **Configure as Variáveis de Ambiente:**
    - Crie um arquivo `.env` na raiz do projeto.
    - Acesse a página `/install` da aplicação em execução para configurar as credenciais do banco de dados (`DB_HOST`, `DB_USER`, etc.).
    - Adicione sua chave da API do Google AI para as funcionalidades de IA:
      ```env
      GOOGLE_API_KEY=sua_chave_google_api
      ```

## Executando Localmente

1.  **Inicie o servidor de desenvolvimento:**
    Este comando iniciará a aplicação Next.js na porta `9002` por padrão.
    ```bash
    npm run dev
    ```

2.  **Acesse a aplicação:**
    Abra seu navegador e acesse [http://localhost:9002](http://localhost:9002).

3.  **Instalação do Banco de Dados:**
    - Na primeira vez que executar, acesse [http://localhost:9002/install](http://localhost:9002/install).
    - Siga os passos para conectar ao seu banco de dados e criar as tabelas necessárias.

4.  **Registro de Usuário:**
    - Após a instalação, vá para [http://localhost:9002/register](http://localhost:9002/register) para criar sua conta.
    - **Importante:** O primeiro usuário a se registrar será automaticamente definido como `admin`.

## Scripts Disponíveis

- `npm run dev`: Inicia o servidor de desenvolvimento.
- `npm run build`: Compila a aplicação para produção.
- `npm run start`: Inicia o servidor de produção após o build.
- `npm run lint`: Executa o linter para verificar a qualidade do código.
- `npm run typecheck`: Verifica os tipos do TypeScript sem emitir arquivos.
