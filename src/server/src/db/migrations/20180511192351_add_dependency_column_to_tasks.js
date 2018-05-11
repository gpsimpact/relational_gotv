exports.up = function(knex) {
  return Promise.all([
    knex.raw('ALTER TABLE tasks ADD COLUMN IF NOT EXISTS only_after_completion_of VARCHAR;'),
  ]);
};

exports.down = function(knex) {
  return Promise.all([
    knex.raw('ALTER TABLE tasks DROP COLUMN IF EXISTS only_after_completion_of;'),
  ]);
};
