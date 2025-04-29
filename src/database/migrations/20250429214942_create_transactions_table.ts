import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('transactions', (table) => {
    table.uuid('id').primary();
    table.float('amount').notNullable();
    table.string('sender_wallet').notNullable();
    table.string('receiver_wallet').notNullable();
    table.enum('type', ['FUND', 'TRANSFER', 'WITHDRAW']).notNullable();
    table.enum('status', ['PENDING', 'SUCCESS', 'FAILED']).defaultTo('PENDING');
    table.string('reference').unique().notNullable();
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('transactions');
}
