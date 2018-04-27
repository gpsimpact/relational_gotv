import DataLoader from 'dataloader';
import { map } from 'lodash';
import { mapTo } from '../utils';

class PotentialVotersConnector {
  constructor({ sqlDb }) {
    this.sqlDb = sqlDb;
  }

  pvByUserById = new DataLoader(keys =>
    this.sqlDb
      .table('potential_voters')
      .whereIn('id', keys)
      .select()
      .then(mapTo(keys, x => x.id))
  );

  createPotentialVoter = data =>
    this.sqlDb
      .table('potential_voters')
      .insert(data)
      .returning('*');

  updatePotentialVoterById = (id, data) =>
    this.sqlDb
      .table('potential_voters')
      .update(data)
      .where({ id })
      .returning('*');

  queryPvByUserByOrg = fetchPayloads =>
    this.sqlDb
      .table('potential_voters')
      .whereIn('user_email', map(fetchPayloads, 'user_email'))
      .whereIn('org_id', map(fetchPayloads, 'org_id'))
      .select();

  PvPointsById = new DataLoader(keys =>
    this.sqlDb
      .table('pv_points_rollup')
      .whereIn('id', keys)
      .then(mapTo(keys, x => x.id))
  );
}

export default PotentialVotersConnector;
