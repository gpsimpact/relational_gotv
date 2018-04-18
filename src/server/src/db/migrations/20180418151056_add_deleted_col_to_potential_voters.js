exports.up = function(knex) {
  return knex.schema.alterTable('potential_voters', t => {
    t.boolean('deleted').defaultTo(false);
  });
};

exports.down = function(knex) {
  return knex.schema.table('potential_voters', t => {
    t.dropColumn('deleted');
  });
};
