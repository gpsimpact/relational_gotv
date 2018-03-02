import DataLoader from 'dataloader';
import { mapTo } from '../utils';

class RegistrantConnector {
  constructor({ sqlDb }) {
    this.sqlDb = sqlDb;
  }

  registrantById = new DataLoader(keys =>
    this.sqlDb
      .table('registrants')
      .whereIn('id', keys)
      .select()
      .then(mapTo(keys, x => x.id))
  );

  updateRegistrantById = (id, data) =>
    this.sqlDb
      .table('registrants')
      .where({ id })
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
