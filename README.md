#  Chatbot de Atendimento IA - Medipreço

Este é um projeto full-stack de chatbot funcional desenvolvido como parte do case técnico para a Medipreço. O objetivo é criar um agente conversacional com IA (Gemini) capaz de responder dúvidas sobre a empresa com um tom de voz natural e humano, com base em uma base de conhecimento fornecida.

O projeto utiliza uma arquitetura React (Frontend) + Node.js (Backend) com um banco de dados SQLite para persistência de dados e autenticação de usuário.

##  Funcionalidades Principais

* **Arquitetura Full-Stack:** Frontend (React) desacoplado do Backend (Node.js).
* **Segurança:** A chave da API do Gemini é 100% segura no backend, protegida por um arquivo `.env`.
* **Autenticação de Usuário:** Sistema completo de Registro e Login (Email/Senha) com persistência de sessão.
* **CRUD por Usuário:** O histórico do chat é salvo e carregado por usuário, persistindo no banco de dados (SQLite).
* **Agente de IA (Gemini):** A IA responde estritamente com base em uma base de conhecimento curada (`contexto.js`).
* **UI/UX:** Interface limpa, responsiva, formatada em Markdown e alinhada à identidade visual da Medipreço.
* **Portabilidade:** A aplicação é totalmente "dockerizada" e pode ser iniciada com um único comando.

##  Tecnologias Utilizadas

* **Frontend:** React (com Vite)
* **Backend:** Node.js (com Express)
* **Banco de Dados:** SQLite
* **Autenticação:** JWT (JSON Web Tokens) e `bcryptjs`
* **Containerização:** Docker e Docker Compose

---

##  Como Executar com Docker 

Este é o método mais fácil e rápido para rodar o projeto, pois ele cuida de todas as instalações e configurações automaticamente.

### 1. Pré-requisitos

* Docker e Docker Compose instalados.

### 2. Configuração da API Key

O Docker precisa da sua chave de API para o backend funcionar.

1.  **Crie o arquivo `.env`:** Na pasta `backend/`, crie um arquivo chamado `.env`.
2.  **Copie o conteúdo** do arquivo `backend/.env.example` para dentro do seu novo `.env`.
3.  **Insira sua chave:** Substitua `SUA_CHAVE_AQUI` pela sua chave real do Google Gemini.

### 3. Rodando a Aplicação

Na **pasta raiz** do projeto (`chat-medipreco-ia/`), execute o seguinte comando:

```bash
docker-compose up --build
```

##  Como Executar Localmente (Método Manual)

Se preferir rodar os serviços manualmente sem o Docker.

### 1. Pré-requisitos

* Node.js (v18 ou superior)
* npm (ou yarn)
* Uma Chave de API do Google Gemini.

### 2. Configuração do Backend

Você precisará de um terminal para o backend.

```bash
# 1. Navegue até a pasta do backend
cd backend

# 2. Instale as dependências
npm install

# 3. Configure a API Key
# Crie o arquivo .env e insira sua chave
cp .env.example .env
# (Edite o .env e cole sua chave)

# 4. Inicie o servidor backend
node server.js
# O servidor estará rodando em http://localhost:3001
```

### 3. Configuração do Frontend

Você precisará de um **segundo terminal** para o frontend.

```bash
# 1. Navegue até a pasta do frontend
cd frontend

# 2. Instale as dependências
npm install

# 3. Inicie o servidor de desenvolvimento
npm run dev
# O servidor estará rodando em http://localhost:5173
```

Abra seu navegador e acesse: **`http://localhost:5173/`**
```
