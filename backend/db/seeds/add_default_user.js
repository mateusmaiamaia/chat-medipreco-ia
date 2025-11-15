import bcrypt from 'bcryptjs';

export async function seed(knex) {
  await knex('messages').del();
  await knex('users').del();

  const defaultEmail = 'teste@medipreco.com';
  const defaultName = 'Usuário Teste';
  const defaultPassword = '123';
  const hashedPassword = bcrypt.hashSync(defaultPassword, 8);

  await knex('users').insert([
    {
      email: defaultEmail, 
      hashedPassword: hashedPassword, 
      name: defaultName
    }
  ]);
}