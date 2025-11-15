import db from '../db/index.js';

const TABLE_NAME = 'messages';

export const messageRepository = {
  getHistoryByEmail: async (userEmail) => {
    return db(TABLE_NAME)
      .select('sender', 'text')
      .where({ userEmail })
      .orderBy('timestamp', 'asc');
  },

  create: async (sender, text, userEmail) => {
    return db(TABLE_NAME).insert({
      sender,
      text,
      userEmail,
    });
  },

  deleteHistoryByEmail: async (userEmail) => {
    return db(TABLE_NAME).where({ userEmail }).del();
  }
};