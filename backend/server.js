import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import db from './db/index.js';
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
    console.log("Rodando migrações do Knex...");
    await db.migrate.latest();
    console.log("Migrações concluídas.");

    const users = await db('users').select('id').limit(1);
    if (users.length === 0) {
      console.log("Banco de dados vazio. Rodando seeds do Knex...");
      await db.seed.run();
      console.log("Seeds concluídos.");
    } else {
      console.log("Banco de dados já populado. Pulando seeds.");
    }

    app.listen(PORT, () => {
      console.log(`🚀 Servidor backend rodando na porta ${PORT}`);
    });
  } catch (err) {
    console.error("Falha ao iniciar o servidor:", err);
    process.exit(1);
  }
};

startServer();