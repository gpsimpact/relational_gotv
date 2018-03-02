exports.up = function(knex, Promise) {
  return knex.schema.hasTable('potential_voters').then(exists => {
    if (!exists) {
      return knex.schema.createTable('potential_voters', table => {
        table
          .string('id')
          .defaultTo(knex.raw('uuid_generate_v4()'))
          .notNullable()
          .primary();
        table.string('first_name');
        table.string('last_name');
        table.string('city');
        table
          .string('user_email')
          .references('email')
          .inTable('users');
        table
          .string('org_id')
          .references('id')
          .inTable('organizations');
        table.string('state_file_id');
        table.boolean('vo_ab_requested').defaultTo(false);
        table.string('vo_ab_requested_iso8601');
        table.boolean('vo_voted').defaultTo(false);
        table.string('vo_voted_iso8601');
        table.string('vo_voted_method');
      });
    }
  });
};

exports.down = function(knex, Promise) {
  return knex.raw('DROP TABLE IF EXISTS potential_voters CASCADE');
};
