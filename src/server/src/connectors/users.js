import DataLoader from 'dataloader';
import { mapTo } from '../utils';

class UserConnector {
  constructor({ sqlDb }) {
    this.sqlDb = sqlDb;
  }

  userByEmail = new DataLoader(keys =>
    this.sqlDb
      .table('users')
      .whereIn('email', keys)
      .select()
      .then(mapTo(keys, x => x.email))
  );

  createNewUser = data =>
    this.sqlDb
      .table('users')
      .insert(data)
      .returning('*');

  updateUserByEmail = (email, data) =>
    this.sqlDb
      .table('users')
      .update(data)
      .where({ email })
      .returning('*');
}

export default UserConnector;
