# Guia de Implantação em uma VPS

Este guia fornece um passo a passo para implantar sua aplicação Next.js em um Servidor Virtual Privado (VPS) com Ubuntu.

## Pré-requisitos

Antes de começar, certifique-se de que sua VPS tenha:
1.  **Acesso SSH** com um usuário sudo.
2.  **Node.js** (versão 18 ou superior).
3.  **Nginx** (ou outro servidor web para atuar como reverse proxy).
4.  Um **domínio** apontado para o IP da sua VPS.

## Passo 1: Preparar o Código

1.  **Git Repository:** Envie todo o código do seu projeto para um repositório Git (como GitHub, GitLab ou Bitbucket).
2.  **Arquivo `.env`:** O arquivo `.env` contém suas chaves secretas e credenciais de banco de dados. **NÃO** envie este arquivo para o seu repositório Git. Você o criará manualmente no servidor.

## Passo 2: Configurar o Servidor

1.  **Conecte-se à sua VPS:**
    ```bash
    ssh seu_usuario@ip_da_vps
    ```

2.  **Clone o seu projeto:**
    ```bash
    git clone https://seu_repositorio_git.com/projeto.git
    ```

3.  **Navegue até o diretório do projeto:**
    ```bash
    cd nome_do_projeto
    ```

## Passo 3: Instalar Dependências e Construir o Projeto

1.  **Instale as dependências:**
    ```bash
    npm install
    ```

2.  **Crie o arquivo `.env`:**
    Crie o arquivo de ambiente na raiz do seu projeto. Você pode usar o editor `nano`:
    ```bash
    nano .env
    ```
    Copie e cole o conteúdo do seu arquivo `.env` local para este novo arquivo. Ele deve conter suas credenciais do banco de dados e a chave da API do Google:
    ```env
    DB_HOST=seu_host_db
    DB_PORT=3306
    DB_USER=seu_usuario_db
    DB_PASSWORD=sua_senha_db
    DB_NAME=seu_banco_de_dados
    GOOGLE_API_KEY=sua_chave_google_api
    ```
    Pressione `Ctrl+X`, depois `Y` e `Enter` para salvar e sair do `nano`.

3.  **Construa a aplicação para produção:**
    ```bash
    npm run build
    ```
    Isso criará uma pasta `.next` otimizada para produção.

## Passo 4: Executar a Aplicação com PM2

PM2 é um gerenciador de processos que manterá sua aplicação rodando em segundo plano e a reiniciará automaticamente em caso de falhas ou reinicialização do servidor.

1.  **Instale o PM2 globalmente:**
    ```bash
    sudo npm install pm2 -g
    ```

2.  **Inicie sua aplicação:**
    O comando `npm start` executa `next start`. Vamos usar o PM2 para gerenciá-lo.
    ```bash
    pm2 start npm --name "tracklytics" -- start
    ```
    *   `--name "tracklytics"`: Dá um nome fácil de lembrar ao seu processo.

3.  **Verifique se está rodando:**
    ```bash
    pm2 list
    ```
    Você deverá ver o processo "tracklytics" com o status "online".

4.  **Configure o PM2 para iniciar com o sistema:**
    ```bash
    pm2 startup
    ```
    Ele lhe dará um comando para copiar e executar. Execute-o.

5.  **Salve a configuração atual do PM2:**
    ```bash
    pm2 save
    ```

Sua aplicação agora está rodando na porta 9002, mas só está acessível internamente.

## Passo 5: Configurar Nginx como Reverse Proxy

O Nginx direcionará o tráfego público (porta 80 e 443) para a porta onde sua aplicação Next.js está rodando (9002).

1.  **Crie um arquivo de configuração para o seu site:**
    ```bash
    sudo nano /etc/nginx/sites-available/seudominio.com
    ```

2.  **Cole a seguinte configuração, substituindo `seudominio.com`:**
    ```nginx
    server {
        listen 80;
        server_name seudominio.com www.seudominio.com;

        location / {
            proxy_pass http://localhost:9002;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }
    }
    ```
    Salve e feche o arquivo (`Ctrl+X`, `Y`, `Enter`).

3.  **Ative a configuração criando um link simbólico:**
    ```bash
    sudo ln -s /etc/nginx/sites-available/seudominio.com /etc/nginx/sites-enabled/
    ```

4.  **Teste a configuração do Nginx:**
    ```bash
    sudo nginx -t
    ```
    Se tudo estiver ok, você verá uma mensagem de sucesso.

5.  **Reinicie o Nginx:**
    ```bash
    sudo systemctl restart nginx
    ```

## Passo 6: Habilitar SSL (HTTPS) - Recomendado

Use o Certbot para obter um certificado SSL gratuito da Let's Encrypt.

1.  **Instale o Certbot:**
    ```bash
    sudo apt update
    sudo apt install certbot python3-certbot-nginx
    ```

2.  **Obtenha e instale o certificado:**
    ```bash
    sudo certbot --nginx -d seudominio.com -d www.seudominio.com
    ```
    Siga as instruções na tela. O Certbot irá atualizar sua configuração do Nginx automaticamente e configurar a renovação.

## Passo 7: Configuração Final da Aplicação

1.  **Acesse seu domínio** em um navegador: `https://seudominio.com`.
2.  Navegue até `https://seudominio.com/install` para **instalar as tabelas** no seu banco de dados de produção.
3.  Vá para `https://seudominio.com/register` e **crie sua conta de administrador**.
4.  Faça **login** e comece a usar a plataforma!

Sua aplicação está implantada e pronta para produção!
