import DataLoader from 'dataloader';
import { mapTo, mapToMany } from '../utils';

class OrganizationPermissionsConnector {
  constructor({ sqlDb }) {
    this.sqlDb = sqlDb;
  }

  permissionsByEmail = new DataLoader(keys =>
    this.sqlDb
      .table('permissions')
      .whereIn('email', keys)
      .select()
      .then(mapToMany(keys, x => x.email))
  );

  organizationPermissions = new DataLoader(keys =>
    this.sqlDb
      .table('permissions')
      .whereIn('org_hash', keys)
      .select()
      .then(mapToMany(keys, x => x.org_hash))
  );

  addOrganizationPermission = (org_hash, email, permission) =>
    this.sqlDb.table('permissions').insert({
      org_hash,
      email,
      permission,
    });

  removeOrganizationPermission = (org_hash, email, permission) =>
    this.sqlDb
      .table('permissions')
      .where({
        org_hash,
        email,
        permission,
      })
      .delete();
}

export default OrganizationPermissionsConnector;
