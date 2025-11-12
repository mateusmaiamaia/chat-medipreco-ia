#  Chatbot de Atendimento IA - Medipreço

Este é um projeto de chatbot funcional desenvolvido como parte do case técnico para a Medipreço. O objetivo é criar um agente conversacional com IA (Gemini) capaz de responder dúvidas sobre a empresa com um tom de voz natural e humano, com base em uma base de conhecimento fornecida.

##  Funcionalidades Principais

* **Interface de Chat Limpa:** UI/UX focada na simplicidade e fidelidade à identidade visual da Medipreço.
* **Inteligência Artificial (Gemini):** Conecta-se à API do Gemini para gerar respostas.
* **Base de Conhecimento Curada:** A IA responde estritamente com base em um contexto curado dos documentos da Medipreço, garantindo fidelidade nas respostas.
* **Formatação de Resposta:** As respostas da IA são formatadas com Markdown (negrito, listas) para melhor legibilidade.
* **Tratamento de Falha Amigável:** Se uma pergunta está fora do escopo, o bot responde de forma amigável em vez de gerar um erro.

##  Tecnologias Utilizadas

* **Frontend:** React (com Vite)
* **Modelo de IA:** Google Gemini
* **Bibliotecas:**
    * `@google/generative-ai`: Para a conexão com a API do Gemini.
    * `react-markdown`: Para renderizar a formatação das respostas da IA.

---

##  Como Executar o Projeto

Siga estes passos para configurar e executar o projeto localmente.

### 1. Pré-requisitos

* Node.js (v18 ou superior)
* npm (ou yarn)
* Uma Chave de API do Google Gemini (que pode ser obtida no [Google AI Studio](https://aistudio.google.com/app/apikey))

### 2. Instalação

No diretório do projeto, instale as dependências:

```bash
npm install