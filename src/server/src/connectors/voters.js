import DataLoader from 'dataloader';
import { mapTo } from '../utils';
import { map } from 'lodash';

class VoterConnector {
  constructor({ sqlDb }) {
    this.sqlDb = sqlDb;
  }

  voterMultiSearch = (where, whereLike) => {
    const query = this.sqlDb.table('voter_file');
    if (where) {
      query.where(where);
    }
    if (whereLike) {
      map(whereLike, (value, key) => {
        query.where(key, 'ilike', value);
      });
    }
    return query.select();
  };

  voterById = new DataLoader(keys =>
    this.sqlDb
      .table('voter_file')
      .whereIn('state_file_id', keys)
      .select()
      .then(mapTo(keys, x => x.state_file_id))
  );
}

export default VoterConnector;
