exports.up = function(knex) {
  return knex.raw('ALTER TABLE potential_voters ADD COLUMN IF NOT EXISTS deleted BOOLEAN');
  // return knex.schema.alterTable('potential_voters', t => {
  //   t.boolean('deleted').defaultTo(false);
  // });
};

exports.down = function(knex) {
  return knex.raw('ALTER TABLE potential_voters DROP COLUMN deleted CASCADE');
};
