exports.up = function(knex) {
  return knex.schema.hasTable('pv_points_rollup').then(exists => {
    if (!exists) {
      return knex.raw(`
        CREATE VIEW pv_points_rollup AS (
          WITH sums_table AS (
            SELECT
              potential_voters.id,
              pv_task_sums.earned_task_points,
              pv_task_sums.potential_task_points,
              COALESCE(voter_file.propensity_score,0)::INT as propensity_score,
              CASE WHEN potential_voters.state_file_id IS NOT NULL THEN 1 ELSE 0 END AS matched_to_file,
              CASE WHEN voter_file.vo_ab_requested_primary = true THEN 1 ELSE 0 END AS vo_ab_requested_primary,
              CASE WHEN voter_file.vo_voted_method_primary ILIKE '%EARLY%' THEN 1 ELSE 0 END as vo_ab_requested_primary_early,
              CASE WHEN voter_file.vo_voted_primary = true THEN 1 ELSE 0 END AS vo_voted_primary,
              CASE WHEN voter_file.vo_ab_requested_general = true THEN 1 ELSE 0 END AS vo_ab_requested_general,
              CASE WHEN voter_file.vo_voted_method_general ILIKE '%EARLY%' THEN 1 ELSE 0 END as vo_ab_requested_general_early,
              CASE WHEN voter_file.vo_voted_general = true THEN 1 ELSE 0 END AS vo_voted_general
            FROM potential_voters
            LEFT JOIN (
              SELECT 
                potential_voters.id as pv_id,
                SUM( CASE WHEN tasks.status = 'COMPLETE' THEN tasks.point_value ELSE 0 END) as earned_task_points,
                SUM( CASE WHEN tasks.dependency_met = TRUE AND tasks.time_constraint_available = TRUE THEN tasks.point_value ELSE 0 END) as potential_task_points
              FROM potential_voters 
              LEFT JOIN task_availability tasks ON tasks.pv_id = potential_voters.id
              GROUP BY 1
            ) pv_task_sums ON potential_voters.id = pv_task_sums.pv_id
            LEFT JOIN voter_file on potential_voters.state_file_id = voter_file.state_file_id
          )
          SELECT
            id,
            (earned_task_points * 1) -- task_points_earned
            + (matched_to_file * 1) -- 1 point for each voter matched to file
            + (vo_ab_requested_primary * 5) -- 5 points for each voter who applied to VBM in primary
            + (vo_ab_requested_general * 5) -- 5 points for each voter who applied to VBM in general
            + (vo_ab_requested_primary_early * 5) -- 5 points for each voter who votes early in primary
            + (vo_ab_requested_general_early * 5) -- 5 points for each voter who votes early in general
            + (vo_voted_primary * 15 * (
            CASE 
              WHEN propensity_score = 0 THEN 5
              WHEN propensity_score = 1 THEN 4
              WHEN propensity_score = 2 THEN 3
              WHEN propensity_score = 3 THEN 2
              WHEN propensity_score = 4 THEN 1
              ELSE 1
            END
            )) -- 15 points for each voter who voted in primary + propensity bonus
            + (vo_voted_general * 10 * (
              CASE 
                WHEN propensity_score = 0 THEN 5
                WHEN propensity_score = 1 THEN 4
                WHEN propensity_score = 2 THEN 3
                WHEN propensity_score = 3 THEN 2
                WHEN propensity_score = 4 THEN 1
                ELSE 1
              END
            )) -- 10 points for each voter who voted in general + propensity bonus
            AS earned,
            potential_task_points AS potential
          FROM sums_table
        );
      `);
    }
  });
};

exports.down = function(knex) {
  return knex.raw('DROP VIEW IF EXISTS pv_points_rollup CASCADE');
};
