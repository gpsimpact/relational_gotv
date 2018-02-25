import DataLoader from 'dataloader';
import { mapTo } from '../utils';

class RegistrantConnector {
  constructor({ sqlDb }) {
    this.sqlDb = sqlDb;
  }

  registrantByHash = new DataLoader(keys =>
    this.sqlDb
      .table('registrants')
      .whereIn('hash', keys)
      .select()
      .then(mapTo(keys, x => x.hash))
  );

  updateRegistrantByHash = (hash, data) =>
    this.sqlDb
      .table('registrants')
      .where({ hash })
      .update(data)
      .returning('*');

  insertRegistrant = data => {
    return this.sqlDb
      .table('registrants')
      .insert(data)
      .returning('*');
  };
}

export default RegistrantConnector;
