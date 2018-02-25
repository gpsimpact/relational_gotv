import DataLoader from 'dataloader';
import { mapTo } from '../utils';

class OrganizationConnector {
  constructor({ sqlDb }) {
    this.sqlDb = sqlDb;
  }

  organizationByHash = new DataLoader(keys =>
    this.sqlDb
      .table('organizations')
      .whereIn('hash', keys)
      .select()
      .then(mapTo(keys, x => x.hash))
  );
}

export default OrganizationConnector;
