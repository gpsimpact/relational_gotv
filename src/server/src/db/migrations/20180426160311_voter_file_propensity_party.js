exports.up = function(knex) {
  return knex.schema.alterTable('voter_file', t => {
    t.integer('propensity_score').defaultTo(0);
    t.string('party');
  });
};

exports.down = function(knex) {
  return knex.raw(
    'ALTER TABLE voter_file DROP COLUMN propensity_score CASCADE, DROP COLUMN party CASCADE'
  );
};
