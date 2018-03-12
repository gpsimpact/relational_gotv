exports.up = function(knex) {
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
      });
    }
  });
};

exports.down = function(knex) {
  return knex.raw('DROP TABLE IF EXISTS potential_voters CASCADE');
};
