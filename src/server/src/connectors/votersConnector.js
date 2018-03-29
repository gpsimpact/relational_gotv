import DataLoader from 'dataloader';
import { mapTo } from '../utils';
import { map } from 'lodash';
// import { filterQuery } from '../db/filterQuery';
// import { paginator } from '../db/paginator';
// import { orderer } from '../db/order';

class VoterConnector {
  constructor({ sqlDb }) {
    this.sqlDb = sqlDb;
  }

  // voterMultiSearch = async (where, orderBy, limit, after) => {
  //   let query = this.sqlDb.table('voter_file');
  //   query = filterQuery(query, where);

  //   // smart defaults
  //   limit = limit || 25;
  //   // const ordered = orderer(query, order);
  //   let paginated = await paginator(this.sqlDb, query, orderBy, limit, after, 'state_file_id');
  //   return paginated;
  // };

  // voterSingleSearch = (where, whereLike) => {
  //   const query = this.sqlDb.table('voter_file');
  //   if (where) {
  //     query.where(where);
  //   }
  //   if (whereLike) {
  //     map(whereLike, (value, key) => {
  //       query.where(key, 'ilike', value);
  //     });
  //   }
  //   return query.select().first();
  // };

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
          'state_file_id, (20 + CASE WHEN vo_ab_requested THEN 20 ELSE 0 END + CASE WHEN vo_voted THEN 20 ELSE 0 END) as total_vo_points'
        )
      )
      .groupBy('state_file_id')
      .then(mapTo(keys, x => x.state_file_id))
  );
}

export default VoterConnector;
