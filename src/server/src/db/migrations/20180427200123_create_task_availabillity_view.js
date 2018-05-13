exports.up = function(knex) {
  return knex.schema.hasTable('task_availability').then(exists => {
    if (!exists) {
      return knex.raw(`
        CREATE VIEW task_availability AS (
          SELECT 
            pre.*
          FROM (
            SELECT
              t1.*,
              CASE
                WHEN t1.status = 'COMPLETE' THEN false
                ELSE true
              END as status_available,
              CASE
                WHEN t2.status IS NULL THEN true
                WHEN t2.status = 'COMPLETE' THEN true
                ELSE false
              END as dependency_met,
              CASE
                WHEN (not_visible_before IS NULL or not_visible_before <= now()) AND (not_visible_after IS NULL or not_visible_after >= now()) THEN true
                ELSE false
              END as time_constraint_available
            FROM tasks t1
            LEFT JOIN LATERAL (
              SELECT 
                status
              FROM tasks 
              WHERE t1.only_after_completion_of = id 
              LIMIT 1
            ) t2 ON true
          ) pre
        );
      `);
    }
  });
};

exports.down = function(knex) {
  return knex.raw('DROP VIEW IF EXISTS task_availability CASCADE');
};
