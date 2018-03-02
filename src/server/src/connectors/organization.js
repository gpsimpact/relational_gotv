import DataLoader from 'dataloader';
import { mapTo } from '../utils';

class OrganizationConnector {
  constructor({ sqlDb }) {
    this.sqlDb = sqlDb;
  }

  organizationById = new DataLoader(keys =>
    this.sqlDb
      .table('organizations')
      .whereIn('id', keys)
      .select()
      .then(mapTo(keys, x => x.id))
  );

  organizationBySlug = new DataLoader(keys =>
    this.sqlDb
      .table('organizations')
      .whereIn('slug', keys)
      .select()
      .then(mapTo(keys, x => x.slug))
  );
}

export default OrganizationConnector;
