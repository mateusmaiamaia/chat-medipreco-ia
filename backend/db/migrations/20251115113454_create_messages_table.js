export async function up(knex) {
  return knex.schema.createTable('messages', (table) => {
    table.increments('id').primary();
    table.string('sender').notNullable();
    table.text('text').notNullable();
    table.timestamp('timestamp').defaultTo(knex.fn.now());
    
    table.string('userEmail').references('email').inTable('users').onDelete('CASCADE');
  });
}

export async function down(knex) {
  return knex.schema.dropTable('messages');
}