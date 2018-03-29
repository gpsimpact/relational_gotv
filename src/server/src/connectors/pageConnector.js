import DataLoader from 'dataloader';
import { map } from 'lodash';
import { decodeDeterministicCacheId } from '../utils';
import { filterQuery } from '../db/filterQuery';
import { paginator } from '../db/paginator';

class PotentialVotersConnector {
  constructor({ sqlDb }) {
    this.sqlDb = sqlDb;
  }

  pageLoader = new DataLoader(keys => this.batchLoadPages(keys));

  loadSinglePage = key => {
    // it would be easy to cache with redis here...
    // attempt to load key from redis
    // if not present, continue below to load from db
    // after db load, store in redis. fetchPayload would need TTL value

    // return promise of page
    const fetchPayload = decodeDeterministicCacheId(key);
    // now use example of voter search filter, pagination etc.
    let query = this.sqlDb.table(fetchPayload.table.name);
    query = filterQuery(query, fetchPayload.where);

    // const ordered = orderer(query, order);
    let paginated = paginator(
      this.sqlDb,
      query,
      fetchPayload.orderBy,
      fetchPayload.limit,
      fetchPayload.after,
      fetchPayload.table.uniqueColumn
    );
    return paginated;
  };

  batchLoadPages = keys => Promise.resolve(map(keys, key => this.loadSinglePage(key)));
}

export default PotentialVotersConnector;
