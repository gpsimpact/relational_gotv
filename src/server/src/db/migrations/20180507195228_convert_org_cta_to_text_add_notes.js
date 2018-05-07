exports.up = function(knex) {
  return Promise.all([
    knex.raw('ALTER TABLE organizations ALTER COLUMN cta TYPE TEXT'),
    knex.raw('ALTER TABLE organizations ADD COLUMN IF NOT EXISTS admin_notes TEXT;'),
  ]);
};

exports.down = function(knex) {
  return Promise.all([
    knex.raw('ALTER TABLE organizations ALTER COLUMN cta TYPE VARCHAR'),
    knex.raw('ALTER TABLE organizations DROP COLUMN IF EXISTS admin_notes;'),
  ]);
};
