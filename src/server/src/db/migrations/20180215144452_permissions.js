exports.up = function(knex) {
  return knex.schema.createTableIfNotExists('permissions', table => {
    table.enu('permission', [
      'READ_ONLY', // Read only permissions
      'ADMIN', // can grant/revoke permissions to others
    ]);
    table
      .string('org_hash')
      .references('hash')
      .inTable('organizations');
    table.string('email');
    table.primary(['permission', 'org_hash', 'email']);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.raw('DROP TABLE IF EXISTS permissions CASCADE');
};
