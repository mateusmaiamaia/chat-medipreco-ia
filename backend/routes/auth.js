import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getPool } from '../db.js';

const router = Router();
const pool = getPool();
const JWT_SECRET = process.env.JWT_SECRET || 'seu-segredo-super-secreto-padrao';

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: "Nome, e-mail e senha são obrigatórios." });
  }

  const hashedPassword = bcrypt.hashSync(password, 8);

  try {
    await pool.query(
      "INSERT INTO users (name, email, hashedPassword) VALUES ($1, $2, $3)",
      [name, email, hashedPassword]
    );
    res.status(201).json({ message: "Usuário cadastrado com sucesso." });
  } catch (err) {
    if (err.code === '23505') { 
      return res.status(409).json({ error: "Este e-mail já está em uso." });
    }
    console.error(err);
    return res.status(500).json({ error: "Erro ao cadastrar usuário." });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email e senha são obrigatórios." });
  }

  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    const user = result.rows[0];

    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }

    const passwordIsValid = bcrypt.compareSync(password, user.hashedpassword);
    if (!passwordIsValid) {
      return res.status(401).json({ error: "Senha inválida." });
    }

    const token = jwt.sign({ email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '24h' });
    res.status(200).json({ token: token, email: user.email, name: user.name });
  } catch (err) {
    console.error(err);
    return res.status(5E+2).json({ error: "Erro no servidor." });
  }
});

export default router;