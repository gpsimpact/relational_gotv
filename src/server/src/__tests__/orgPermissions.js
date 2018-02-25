import { graphql } from 'graphql';
import db from '../db';
import schema from '../graphql/schema';
import faker from 'faker';
import MakeContext from '../Context';
import { find } from 'lodash';
// import bcrypt from 'bcrypt';
// import jwt from 'jsonwebtoken';
import { generateFakeUsers } from '../utils';

beforeAll(async () => await db.migrate.latest({ directory: 'src/db/migrations' }));
beforeEach(
  async () =>
    await Promise.all([
      db.raw('TRUNCATE TABLE permissions CASCADE'),
      db.raw('TRUNCATE TABLE organizations CASCADE'),
      db.raw('TRUNCATE TABLE users CASCADE'),
    ])
);
afterAll(async () => await db.destroy());

describe('Organizational Permissions', () => {
  test('admin can add permission to organization', async () => {
    const users = generateFakeUsers(2, 16);
    const org1 = faker.random.uuid();
    const adminPermission = {
      [org1]: ['ADMIN'],
    };
    await db('organizations').insert({ hash: org1, name: faker.company.companyName() });

    const rootValue = {};
    const context = new MakeContext({
      user: { email: users[0].email, permissions: adminPermission },
    });

    const query = `
      mutation {
          addOrganizationPermission(
            organizationHash: "${org1}",
            permission: READ_ONLY,
            userEmail: "${users[1].email}"
          ) {
            organization {
              hash
            }
            users {
              email
              permissions
            }
          }
        }
    `;
    const result = await graphql(schema, query, rootValue, context);
    // console.log(JSON.stringify(result, null, '\t'));
    expect(
      find(result.data.addOrganizationPermission.users, {
        email: users[1].email,
        permissions: ['READ_ONLY'],
      })
    ).not.toBeUndefined();
  });

  test('non-admin can not', async () => {
    const users = generateFakeUsers(2, 16);
    const org1 = faker.random.uuid();
    const adminPermission = {
      [org1]: ['READ_ONLY'],
    };
    await db('organizations').insert({ hash: org1, name: faker.company.companyName() });

    const rootValue = {};
    const context = new MakeContext({
      user: { email: users[0].email, permissions: adminPermission },
    });

    const query = `
      mutation {
          addOrganizationPermission(
            organizationHash: "${org1}",
            permission: READ_ONLY,
            userEmail: "${users[1].email}"
          ) {
            organization {
              hash
            }
            users {
              email
              permissions
            }
          }
        }
    `;
    const result = await graphql(schema, query, rootValue, context);
    expect(result.errors.length).toBeGreaterThanOrEqual(1);
    expect(find(result.errors, { message: 'Insufficient permissions.' })).not.toBeUndefined();
  });

  test('admin can remove permission from organization', async () => {
    const users = generateFakeUsers(3, 17);
    const org1 = faker.random.uuid();
    const adminPermission = {
      [org1]: ['ADMIN'],
    };
    await db('organizations').insert({ hash: org1, name: faker.company.companyName() });
    await db('permissions').insert({
      org_hash: org1,
      email: users[1].email,
      permission: 'READ_ONLY',
    });
    await db('permissions').insert({
      org_hash: org1,
      email: users[2].email,
      permission: 'ADMIN',
    });

    const rootValue = {};
    const context = new MakeContext({
      user: { email: users[0].email, permissions: adminPermission },
    });
    const query = `
      mutation {
          removeOrganizationPermission(
            organizationHash: "${org1}",
            permission: READ_ONLY,
            userEmail: "${users[1].email}"
          ) {
            organization {
              hash
            }
            users {
              email
              permissions
            }
          }
        }
    `;
    const result = await graphql(schema, query, rootValue, context);
    // console.log(JSON.stringify(result, null, '\t'));
    expect(
      find(result.data.removeOrganizationPermission.users, {
        email: users[1].email,
        permission: ['READ_ONLY'],
      })
    ).toBeUndefined();
  });

  test('non-admin can not remove permission from organization', async () => {
    const users = generateFakeUsers(3, 17);
    const org1 = faker.random.uuid();
    const adminPermission = {
      [org1]: ['READ_ONLY'],
    };
    await db('organizations').insert({ hash: org1, name: faker.company.companyName() });
    await db('permissions').insert({
      org_hash: org1,
      email: users[1].email,
      permission: 'READ_ONLY',
    });
    await db('permissions').insert({
      org_hash: org1,
      email: users[2].email,
      permission: 'ADMIN',
    });

    const rootValue = {};
    const context = new MakeContext({
      user: { email: users[0].email, permissions: adminPermission },
    });
    const query = `
      mutation {
          removeOrganizationPermission(
            organizationHash: "${org1}",
            permission: READ_ONLY,
            userEmail: "${users[1].email}"
          ) {
            organization {
              hash
            }
            users {
              email
              permissions
            }
          }
        }
    `;
    const result = await graphql(schema, query, rootValue, context);
    expect(result.errors.length).toBeGreaterThanOrEqual(1);
    expect(find(result.errors, { message: 'Insufficient permissions.' })).not.toBeUndefined();
  });

  test('can not add non-enumarated permission', async () => {
    const users = generateFakeUsers(3, 19);
    const org1 = faker.random.uuid();
    const adminPermission = {
      [org1]: 'ADMIN',
    };
    await db('organizations').insert({ hash: org1, name: faker.company.companyName() });
    await db('permissions').insert({
      org_hash: org1,
      email: users[1].email,
      permission: 'READ_ONLY',
    });
    await db('permissions').insert({
      org_hash: org1,
      email: users[2].email,
      permission: 'ADMIN',
    });

    const rootValue = {};
    const context = new MakeContext({
      user: { email: users[0].email, permissions: adminPermission },
    });
    const query = `
      mutation {
          addOrganizationPermission(
            organizationHash: "${org1}",
            permission: BAD_OPTION,
            userEmail: "${users[1].email}"
          ) {
            organization {
              hash
            }
            users {
              email
              permissions
            }
          }
        }
    `;
    const result = await graphql(schema, query, rootValue, context);
    // console.log(JSON.stringify(result, null, '\t'));
    expect(result.errors.length).toBeGreaterThanOrEqual(1);
  });
});
