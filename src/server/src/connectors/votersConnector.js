import DataLoader from 'dataloader';
import { mapTo } from '../utils';
// import { map } from 'lodash';
// import { filterQuery } from '../db/filterQuery';
// import { paginator } from '../db/paginator';
// import { orderer } from '../db/order';

class VoterConnector {
  constructor({ sqlDb }) {
    this.sqlDb = sqlDb;
  }

  voterById = new DataLoader(keys =>
    this.sqlDb
      .table('voter_file')
      .whereIn('state_file_id', keys)
      .select()
      .then(mapTo(keys, x => x.state_file_id))
  );

  voterPointsById = new DataLoader(keys =>
    this.sqlDb
      .table('voter_file')
      .whereIn('state_file_id', keys)
      .select(
        this.sqlDb.raw(
          'state_file_id, (20 + CASE WHEN vo_ab_requested_primary THEN 20 ELSE 0 END + CASE WHEN vo_voted_primary THEN 20 ELSE 0 END + CASE WHEN vo_ab_requested_general THEN 20 ELSE 0 END + CASE WHEN vo_voted_general THEN 20 ELSE 0 END) as total_vo_points'
        )
      )
      .groupBy('state_file_id')
      .then(mapTo(keys, x => x.state_file_id))
  );
}

export default VoterConnector;
