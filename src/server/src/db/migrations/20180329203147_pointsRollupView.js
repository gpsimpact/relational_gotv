exports.up = function(knex) {
  return knex.schema.hasTable('points_rollup').then(exists => {
    if (!exists) {
      return knex.raw(`
        CREATE VIEW points_rollup AS (
          SELECT
            ROW_NUMBER() OVER (ORDER BY potential_voters.user_email ASC, potential_voters.org_id ASC) AS "id",
            potential_voters.user_email,
            potential_voters.org_id,
            SUM( CASE WHEN (tasks.status = 'COMPLETE') THEN tasks.point_value ELSE 0 END) AS earned,
            SUM( CASE WHEN (tasks.status = 'INCOMPLETE' OR tasks.status = 'PENDING' ) THEN tasks.point_value ELSE 0 END) AS potential
          FROM tasks
          LEFT JOIN potential_voters ON tasks.pv_id = potential_voters.id
          GROUP BY 2,3
        );
      `);
    }
  });
};

exports.down = function(knex) {
  return knex.raw('DROP VIEW IF EXISTS points_rollup CASCADE');
};
