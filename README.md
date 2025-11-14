# Chatbot de Atendimento IA - Medipreço

Este é um projeto full-stack de chatbot funcional desenvolvido como parte do case técnico para a Medipreço. O objetivo é criar um agente conversacional com IA (Gemini) capaz de responder dúvidas sobre a empresa com um tom de voz natural e humano, com base em uma base de conhecimento fornecida.

O projeto utiliza uma arquitetura React (Frontend) + Node.js (Backend) com um banco de dados PostgreSQL para persistência de dados e autenticação de usuário.

##  Destaques do Projeto

- **Arquitetura Full-Stack:** Frontend (React) desacoplado do Backend (Node.js).  
- **Segurança:** A chave da API do Gemini é 100% segura no backend, protegida por um arquivo `.env`.  
- **Autenticação de Usuário:** Sistema completo de Registro e Login (Email/Senha/Nome) com persistência de sessão (JWT).  
- **CRUD por Usuário:** O histórico do chat é salvo e carregado por usuário, persistindo no banco de dados (PostgreSQL).  
- **Banco de Dados Auto-Suficiente:** O banco de dados se inicializa automaticamente na primeira vez que o servidor é executado, criando as tabelas e um usuário de teste.  
- **Agente de IA (Gemini):** A IA responde estritamente com base em uma base de conhecimento curada.  
- **UI/UX:** Interface limpa, responsiva, formatada em Markdown e alinhada à identidade visual da Medipreço.  
- **Portabilidade:** A aplicação é totalmente "dockerizada" e pode ser iniciada com um único comando.

## Tecnologias Utilizadas

- **Frontend:** React (com Vite)  
- **Backend:** Node.js (com Express)  
- **Banco de Dados:** PostgreSQL (Postgres)  
- **Autenticação:** JWT (JSON Web Tokens) e `bcryptjs`  
- **Containerização:** Docker e Docker Compose  

---

##  Como Executar o Projeto

Este projeto é totalmente "dockerizado", garantindo que funcione em qualquer máquina com o Docker instalado, sem a necessidade de configurar Node.js ou um banco de dados manualmente.

### 1. Pré-requisitos: Instalar o Docker

O único requisito é ter o **Docker** e o **Docker Compose** instalados.

- **Windows/Mac:** Baixe o Docker Desktop.  
- **Linux:** Instale o Docker Engine e o Docker Compose Plugin.

### 2. Configuração da API Key

O Docker precisa das suas chaves de API para o backend e para o banco de dados funcionarem.

1.  **Crie o arquivo `.env`:** Na pasta `backend/`, crie um arquivo chamado `.env`.
2.  **Copie o conteúdo** do arquivo `backend/.env.example` para dentro do seu novo `.env`.
3.  **Insira suas chaves:**
    * `GEMINI_API_KEY`: Substitua `SUA_CHAVE_AQUI` pela sua chave real. (Você pode gerar uma chave gratuita no [Google AI Studio](https://aistudio.google.com/app/apikey)).
    * `JWT_SECRET`: Substitua `SEU_SEGREDO_JWT_AQUI` por uma senha longa que você inventar (ex: `meu-chat-secreto-123`).
    * (Você pode deixar os valores de `POSTGRES` como estão, pois eles são para o ambiente Docker).

### 3. Rodando a Aplicação

No diretório raiz do projeto (`chat-medipreco-ia/`), execute:

```bash
docker compose up --build
```

Depois, acesse no navegador:

```
http://localhost:5173/
```

##  Como Usar a Aplicação

Após a aplicação iniciar, você verá a tela de Login. Existem duas formas de acessar o chat:

### Caso 1: Acessar com Usuário de Teste 

Para facilitar a avaliação, um usuário padrão é criado automaticamente pelo servidor.

* **Email:** `teste@medipreco.com`
* **Senha:** `123`

Basta inserir essas credenciais na tela de login para acessar o chat imediatamente.

### Caso 2: Criar um Novo Usuário 

1.  Na tela de login, clique no link "Não tem uma conta? **Cadastre-se**".
2.  Preencha seu Nome, Email e uma Senha.
3.  Após o cadastro, você será redirecionado para a tela de login.
4.  Faça o login com o email e senha que você acabou de criar.

### Funcionalidades do Chat

* **Histórico Persistente:** Seu histórico de chat é salvo. Se você sair e logar novamente, suas mensagens anteriores serão carregadas.
* **Guia Inicial:** Ao logar, o bot te saúda e apresenta um chip de "Ver tópicos de ajuda" para te guiar.
* **Resgate Inteligente:** Se você fizer uma pergunta fora do escopo, o bot irá se desculpar e mostrará o chip "Ver tópicos de ajuda" para te trazer de volta aos tópicos válidos.
* **Novo Chat:** Limpa todo o seu histórico de mensagens e inicia uma nova conversa.
* **Sair:** Faz o logout e te leva de volta para a tela de login.



## 🗃️ Entidades do Banco de Dados (Schema PostgreSQL)

O banco possui duas tabelas principais, criadas automaticamente ao iniciar o servidor.

### **Tabela: `users`**

Armazena as informações de login.

| Coluna           | Tipo   | Chave | Descrição                                     |
|------------------|--------|-------|-----------------------------------------------|
| `id`             | SERIAL | PK    | Identificador único                           |
| `email`          | TEXT   | UNIQUE| E-mail do usuário                             |
| `hashedPassword` | TEXT   | —     | Senha criptografada (bcrypt)                  |
| `name`           | TEXT   | —     | Nome de exibição                              |

### **Tabela: `messages`**

Armazena o histórico do chat.

| Coluna      | Tipo        | Chave | Descrição                                       |
|-------------|-------------|-------|-------------------------------------------------|
| `id`        | SERIAL      | PK    | Identificador único                             |
| `sender`    | TEXT        | —     | "user" ou "ia"                                  |
| `text`      | TEXT        | —     | Conteúdo da mensagem                            |
| `timestamp` | TIMESTAMPTZ | —     | Data e hora do envio                            |
| `userEmail` | TEXT        | FK    | E-mail do usuário (relaciona com `users`)       |
