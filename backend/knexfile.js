import 'dotenv/config';

export default {
  client: 'pg',
  connection: {
    host: process.env.POSTGRES_HOST || 'db',
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB
  },
  migrations: {
    directory: './db/migrations'
  },
  seeds: {
    directory: './db/seeds'
  }
};