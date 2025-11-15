import { authService } from '../services/auth.service.js';

export const authController = {
  register: async (req, res) => {
    try {
      const { name, email, password } = req.body;
      if (!name || !email || !password) {
        return res.status(400).json({ error: "Nome, e-mail e senha são obrigatórios." });
      }
      
      const newUser = await authService.register(name, email, password);
      res.status(201).json({ message: "Usuário cadastrado com sucesso.", user: newUser });
    } catch (err) {
      if (err.message === "Este e-mail já está em uso.") {
        return res.status(409).json({ error: err.message });
      }
      res.status(500).json({ error: "Erro ao cadastrar usuário." });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: "Email e senha são obrigatórios." });
      }
      
      const data = await authService.login(email, password);
      res.status(200).json(data);
    } catch (err) {
      if (err.message === "Usuário não encontrado." || err.message === "Senha inválida.") {
        return res.status(401).json({ error: "Email ou senha inválidos." });
      }
      res.status(500).json({ error: "Erro no servidor." });
    }
  }
};