import db from '../db/index.js';

const TABLE_NAME = 'users';

export const userRepository = {
  findByEmail: async (email) => {
    return db(TABLE_NAME).where({ email }).first();
  },

  create: async (name, email, hashedPassword) => {
    return db(TABLE_NAME)
      .insert({
        name,
        email,
        hashedPassword,
      })
      .returning('*');
  }
};