import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import db from './db/index.js'; // Importa o Knex
import { authenticateToken } from './middleware/auth.js';
import authRoutes from './routes/auth.js';
import chatRoutes from './routes/chat.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors()); 
app.use(express.json()); 

app.use('/api/auth', authRoutes);
app.use('/api/chat', authenticateToken, chatRoutes);

const startServer = async () => {
  try {
    console.log("Verificando conexão com o banco de dados...");
    await db.raw('select 1+1 as result'); 
    console.log("Conexão com o banco de dados bem-sucedida.");

    app.listen(PORT, () => {
      console.log(`🚀 Servidor backend rodando na porta ${PORT}`);
    });
  } catch (err) {
    console.error("Falha ao iniciar o servidor ou conectar ao DB:", err);
    process.exit(1);
  }
};

startServer();