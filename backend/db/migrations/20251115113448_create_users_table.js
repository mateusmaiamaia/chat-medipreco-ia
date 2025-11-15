export async function up(knex) {
  return knex.schema.createTable('users', (table) => {
    table.increments('id').primary();
    table.string('email').notNullable().unique();
    table.string('hashedPassword').notNullable();
    table.string('name');
  });
}

export async function down(knex) {
  return knex.schema.dropTable('users');
}