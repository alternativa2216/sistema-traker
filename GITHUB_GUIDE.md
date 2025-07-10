# Guia para Enviar seu Projeto para o GitHub

Este guia fornece um passo a passo para enviar o código do seu projeto para um novo repositório no GitHub.

## Pré-requisitos

1.  **Conta no GitHub:** Você precisa ter uma conta no GitHub.
2.  **Git instalado:** O Git precisa estar instalado na sua máquina local.
3.  **Código do projeto:** Você precisa ter todos os arquivos do projeto em uma pasta no seu computador.

---

## Passo 1: Criar um Repositório no GitHub

1.  Acesse o [GitHub](https://github.com) e faça login.
2.  Clique no sinal de `+` no canto superior direito e selecione **"New repository"**.
3.  Dê um nome ao seu repositório (ex: `tracklytics-app`).
4.  Escolha se o repositório será **Público** ou **Privado**.
5.  **Importante:** **NÃO** marque as opções "Add a README file", "Add .gitignore" ou "Choose a license", pois seu projeto já possui esses arquivos.
6.  Clique em **"Create repository"**.

Você será redirecionado para a página do seu novo repositório, que mostrará alguns comandos. Vamos usar os comandos da seção **"...or push an existing repository from the command line"**.

---

## Passo 2: Preparar e Enviar seu Código Local

Abra seu terminal ou prompt de comando na pasta onde estão os arquivos do seu projeto.

1.  **Inicialize o Git na pasta do seu projeto:**
    ```bash
    git init -b main
    ```
    Isso cria um novo repositório Git local na branch `main`.

2.  **Adicione todos os arquivos ao Git:**
    ```bash
    git add .
    ```
    O `.` significa "todos os arquivos e pastas". O arquivo `.gitignore` que eu criei garantirá que pastas como `node_modules` sejam ignoradas.

3.  **Faça o "commit" dos seus arquivos:**
    Um commit é como um "ponto de salvamento". Ele registra as alterações no seu repositório local.
    ```bash
    git commit -m "Commit inicial do projeto Tracklytics"
    ```

4.  **Conecte seu repositório local ao repositório do GitHub:**
    Copie a linha de comando da página do seu repositório no GitHub. Ela será parecida com esta (substitua `SEU-USUARIO` e `SEU-REPOSITORIO`):
    ```bash
    git remote add origin https://github.com/SEU-USUARIO/SEU-REPOSITORIO.git
    ```
    Cole e execute este comando no seu terminal.

5.  **Envie ("push") seu código para o GitHub:**
    Este comando envia os arquivos do seu computador para o repositório no GitHub.
    ```bash
    git push -u origin main
    ```

---

## Conclusão

Pronto! Após executar esses comandos, recarregue a página do seu repositório no GitHub. Você verá todos os seus arquivos lá.

Agora, sempre que fizer alterações no seu código, você pode enviá-las para o GitHub com os seguintes comandos:
```bash
# Adiciona as novas alterações
git add .

# Faz o commit com uma mensagem descritiva
git commit -m "Adiciona nova funcionalidade de faturamento"

# Envia as alterações para o GitHub
git push origin main
```