exports.up = function(knex) {
  return knex.schema.hasTable('tasks').then(exists => {
    if (!exists) {
      return knex.schema.createTable('tasks', table => {
        table
          .string('id')
          .defaultTo(knex.raw('uuid_generate_v4()'))
          .notNullable()
          .primary();
        table.jsonb('form_schema');
        table
          .string('pv_id')
          .references('id')
          .inTable('potential_voters');
        table.jsonb('form_data');
        table.integer('point_value');
        table.enu('status', [
          'INCOMPLETE', // Read only permissions
          'INPROGRESS', // can grant/revoke permissions to others
          'COMPLETE',
          'SKIPPED',
        ]);
        table.integer('sequence');
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
        table.string('description');
        table.timestamp('not_visible_before');
        table.timestamp('not_visible_after');
      });
    }
  });
};

exports.down = function(knex, Promise) {
  return knex.raw('DROP TABLE IF EXISTS tasks CASCADE');
};
