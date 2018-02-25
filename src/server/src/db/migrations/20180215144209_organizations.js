exports.up = function(knex) {
  return knex.schema.createTableIfNotExists('organizations', table => {
    table
      .string('hash')
      .defaultTo(knex.raw('uuid_generate_v4()'))
      .notNullable()
      .primary();
    table.string('name').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.raw('DROP TABLE IF EXISTS organizations CASCADE');
};
