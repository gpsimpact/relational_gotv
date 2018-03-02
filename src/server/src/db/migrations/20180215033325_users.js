exports.up = function(knex) {
  return knex.schema.hasTable('users').then(exists => {
    if (!exists) {
      return knex.schema.createTable('users', table => {
        table.string('email').primary();
        table.string('password');
        table.string('first_name');
        table.string('last_name');
        table.boolean('email_verified').defaultTo(false);
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
      });
    }
  });
};

exports.down = function(knex) {
  return knex.raw('DROP TABLE IF EXISTS users CASCADE');
};
