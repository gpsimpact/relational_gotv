exports.up = function(knex) {
  return knex.schema.hasTable('organizations').then(exists => {
    if (!exists) {
      return knex.schema.createTable('organizations', table => {
        table
          .string('id')
          .defaultTo(knex.raw('uuid_generate_v4()'))
          .notNullable()
          .primary();
        table.string('name').notNullable();
        table.string('cta');
        table.string('slug');
        table.string('contact_name');
        table.string('contact_email');
        table.string('contact_phone');
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
      });
    }
  });
};

exports.down = function(knex) {
  return knex.raw('DROP TABLE IF EXISTS organizations CASCADE');
};
