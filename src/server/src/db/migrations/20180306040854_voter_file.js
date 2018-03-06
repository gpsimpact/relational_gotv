exports.up = function(knex) {
  return knex.schema.hasTable('voter_file').then(exists => {
    if (!exists) {
      return knex.schema.createTable('voter_file', table => {
        table
          .string('state_file_id')
          .notNullable()
          .primary();
        table.string('first_name');
        table.string('middle_name');
        table.string('last_name');
        table.string('home_address');
        table.string('city');
        table.string('state');
        table.string('zipcode');
        table.string('dob_iso8601');
        table.boolean('vo_ab_requested').defaultTo(false);
        table.string('vo_ab_requested_iso8601');
        table.boolean('vo_voted').defaultTo(false);
        table.string('vo_voted_iso8601');
        table.string('vo_voted_method');
      });
    }
  });
};

exports.down = function(knex) {
  return knex.raw('DROP TABLE IF EXISTS voter_file CASCADE');
};
