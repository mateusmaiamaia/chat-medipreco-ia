import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { userRepository } from '../repositories/user.repository.js';

const JWT_SECRET = process.env.JWT_SECRET || 'seu-segredo-super-secreto-padrao';

export const authService = {
  register: async (name, email, password) => {
    const hashedPassword = bcrypt.hashSync(password, 8);
    
    try {
      const [newUser] = await userRepository.create(name, email, hashedPassword);
      return newUser;
    } catch (err) {
      if (err.code === '23505') {
        throw new Error("Este e-mail já está em uso.");
      }
      throw new Error("Erro ao cadastrar usuário.");
    }
  },

  login: async (email, password) => {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new Error("Usuário não encontrado.");
    }

    const passwordIsValid = bcrypt.compareSync(password, user.hashedPassword);
    if (!passwordIsValid) {
      throw new Error("Senha inválida.");
    }

    const token = jwt.sign({ email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '24h' });
    return { token, email: user.email, name: user.name };
  }
};