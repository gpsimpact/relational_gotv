exports.up = function(knex) {
  return knex.schema.hasTable('points_rollup').then(exists => {
    if (!exists) {
      return knex.raw(`
        CREATE VIEW points_rollup AS (
          WITH sums_table AS (
            WITH points_pre_calc AS (
              SELECT 
                potential_voters.id AS pv_id,
                potential_voters.user_email,
                potential_voters.org_id,
                pv_task_sums.earned_task_points,
                pv_task_sums.potential_task_points,
                COALESCE(voter_file.propensity_score,0)::INT as propensity_score,
                CASE WHEN potential_voters.state_file_id IS NOT NULL THEN 1 ELSE 0 END AS matched_to_file,
                CASE WHEN voter_file.vo_ab_requested_primary = true THEN 1 ELSE 0 END AS vo_ab_requested_primary,
                CASE WHEN voter_file.vo_voted_method_primary ILIKE '%EARLY%' THEN 1 ELSE 0 END as vo_ab_requested_primary_early,
                CASE WHEN voter_file.vo_voted_primary = true THEN 1 ELSE 0 END AS vo_voted_primary,
                CASE WHEN voter_file.vo_ab_requested_general = true THEN 1 ELSE 0 END AS vo_ab_requested_general,
                CASE WHEN voter_file.vo_voted_method_general ILIKE '%EARLY%' THEN 1 ELSE 0 END as vo_ab_requested_general_early,
                CASE WHEN voter_file.vo_voted_general = true THEN 1 ELSE 0 END AS vo_voted_general,
                (CASE WHEN voter_file.vo_voted_primary = true THEN 1 ELSE 0 END * 15 * (
	            	CASE 
	            		WHEN propensity_score = 0 THEN 5
	            		WHEN propensity_score = 1 THEN 4
	            		WHEN propensity_score = 2 THEN 3
	            		WHEN propensity_score = 3 THEN 2
	            		WHEN propensity_score = 4 THEN 1
	            	END
	            	)
	            ) AS primary_voted_points, -- 15 points for each voter who voted in primary + propensity bonus
	            (CASE WHEN voter_file.vo_voted_general = true THEN 1 ELSE 0 END * 10 * (
	            	CASE 
	            		WHEN propensity_score = 0 THEN 5
	            		WHEN propensity_score = 1 THEN 4
	            		WHEN propensity_score = 2 THEN 3
	            		WHEN propensity_score = 3 THEN 2
	            		WHEN propensity_score = 4 THEN 1
	            	END
	            	)
	            ) AS general_voted_points -- 15 points for each voter who voted in general + propensity bonus
              FROM potential_voters
              -- Join task point calculations
              LEFT JOIN (
                SELECT 
                  potential_voters.id as pv_id,
                  SUM( CASE WHEN tasks.status = 'COMPLETE' THEN tasks.point_value ELSE 0 END) as earned_task_points,
                  SUM( tasks.point_value ) as potential_task_points
                FROM potential_voters 
                LEFT JOIN tasks ON tasks.pv_id = potential_voters.id
                GROUP BY 1
              ) pv_task_sums ON potential_voters.id = pv_task_sums.pv_id
              LEFT JOIN voter_file on potential_voters.state_file_id = voter_file.state_file_id
              WHERE potential_voters.deleted = false
            )
            SELECT
              user_email,
              org_id,
              COUNT(DISTINCT pv_id ) AS total_valid_pvs,
              SUM(earned_task_points) AS earned_task_points,
              SUM(potential_task_points) AS potential_task_points,
              SUM(matched_to_file) AS matched_to_file_count,
              SUM(vo_ab_requested_primary) AS vo_ab_requested_primary_count,
              SUM(vo_ab_requested_primary_early) AS vo_ab_requested_primary_early_count,
              SUM(vo_ab_requested_general) AS vo_ab_requested_general_count,
              SUM(vo_ab_requested_general_early) AS vo_ab_requested_general_early_count,
              SUM(vo_voted_general) AS vo_voted_general_count,
              SUM(primary_voted_points) AS primary_voted_points,
              SUM(general_voted_points) AS general_voted_points
            FROM points_pre_calc
            GROUP BY 1,2
          )
          SELECT
          row_number() OVER (ORDER BY user_email, org_id) AS id,
          user_email,
          org_id,
          (earned_task_points * 1) -- task_points_earned
          + (CASE WHEN total_valid_pvs >= 10 THEN 10 ELSE 0 END) -- 10 point bonus for more than 10 voters
          + (matched_to_file_count * 1) -- 1 point for each voter matched to file
          + (vo_ab_requested_primary_count * 5) -- 5 points for each voter who applied to VBM in primary
          + (vo_ab_requested_general_count * 5) -- 5 points for each voter who applied to VBM in general
          + (vo_ab_requested_primary_early_count * 5) -- 5 points for each voter who votes early in primary
          + (vo_ab_requested_general_early_count * 5) -- 5 points for each voter who votes early in general
          + primary_voted_points -- calculated per PV in points pre calc table
          + general_voted_points -- calculated per PV in points pre calc table
          AS earned,
          potential_task_points AS potential
          FROM sums_table
        );
      `);
    }
  });
};

exports.down = function(knex) {
  return knex.raw('DROP VIEW IF EXISTS points_rollup CASCADE');
};
