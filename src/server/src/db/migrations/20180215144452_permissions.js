exports.up = function(knex) {
  return knex.schema.hasTable('permissions').then(exists => {
    if (!exists) {
      return knex.schema.createTable('permissions', table => {
        table.enu('permission', [
          'READ_ONLY', // Read only permissions
          'ADMIN', // can grant/revoke permissions to others
          'AMBASSADOR',
        ]);
        table
          .string('org_id')
          .references('id')
          .inTable('organizations');
        table.string('email');
        table.primary(['permission', 'org_id', 'email']);
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
      });
    }
  });
};

exports.down = function(knex) {
  return knex.raw('DROP TABLE IF EXISTS permissions CASCADE');
};
