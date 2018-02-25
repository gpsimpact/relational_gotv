exports.up = function(knex) {
  return knex.schema.createTableIfNotExists('registrants', table => {
    table
      .string('hash')
      .defaultTo(knex.raw('uuid_generate_v4()'))
      .notNullable()
      .primary();
    // pre-screen section of federal form
    table.boolean('attest_citizen').defaultTo(false);
    table.boolean('attest_eighteen_plus').defaultTo(false);
    // section 1 of federal form
    table.enu('prefix', ['mr', 'mrs', 'miss', 'ms']);
    table.enu('suffix', ['jr', 'sr', 'ii', 'iii', 'iv']);
    table.string('name_first');
    table.string('name_last');
    table.string('name_middle');
    // section 2 of federal form
    table.string('address_home');
    table.string('address_apt_lot');
    table.string('address_city_town');
    table.string('address_state');
    table.string('address_zipcode');
    // section 3 of federal form
    table.string('mail_address');
    table.string('mail_address_city_town');
    table.string('mail_address_state');
    table.string('mail_address_zipcode');
    // section 4 of federal form
    table.date('dob');
    // section 5 of federal form
    table.string('telephone');
    // section 6 of federal form
    table.string('id_number');
    // section 7 of federal form
    table.string('party');
    // section 8 of federal form
    table.string('race_ethnic');
    // section 9 of federal form
    table.date('date_signed').defaultTo(knex.fn.now());
    table.string('signature_path');
    // section A of federal form
    table.enu('previous_prefix', ['mr', 'mrs', 'miss', 'ms']);
    table.enu('previous_suffix', ['jr', 'sr', 'ii', 'iii', 'iv']);
    table.string('previous_name_first');
    table.string('previous_name_last');
    table.string('previous_name_middle');
    // section B of federal form
    table.string('previous_address_home');
    table.string('previous_address_apt_lot');
    table.string('previous_address_city_town');
    table.string('previous_address_state');
    table.string('previous_address_zipcode');
    // section D of federal form
    table.string('helper');
    // place to record last updated step
    table.string('most_recent_update_label');
    // update / creation flags
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.raw('DROP TABLE IF EXISTS registrants CASCADE');
};
