import DataLoader from 'dataloader';
import { map, filter } from 'lodash';
import { mapTo } from '../utils';

class PotentialVotersConnector {
  constructor({ sqlDb }) {
    this.sqlDb = sqlDb;
  }

  pvByUserByOrg = new DataLoader(
    keys =>
      this.sqlDb
        .table('potential_voters')
        .whereIn('user_email', map(keys, 'user_email'))
        .whereIn('org_id', map(keys, 'org_id'))
        .select()
        .then(rows =>
          map(keys, key => {
            return filter(rows, { user_email: key.user_email, org_id: key.org_id });
          })
        ),
    {
      cacheKeyFn: key => `${key.user_email}:::${key.org_id}`,
    }
  );

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
}

export default PotentialVotersConnector;
