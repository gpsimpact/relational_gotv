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
      .whereIn('org_id', keys)
      .select()
      .then(mapToMany(keys, x => x.org_id))
  );

  addOrganizationPermission = (org_id, email, permission) =>
    this.sqlDb.table('permissions').insert({
      org_id,
      email,
      permission,
    });

  removeOrganizationPermission = (org_id, email, permission) =>
    this.sqlDb
      .table('permissions')
      .where({
        org_id,
        email,
        permission,
      })
      .delete();
}

export default OrganizationPermissionsConnector;
