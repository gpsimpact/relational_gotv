import { graphql } from 'graphql';
import db from '../db';
import schema from '../graphql/schema';
// import faker from 'faker';
import MakeContext from '../Context';
import { find } from 'lodash';
import bcrypt from 'bcrypt';
import faker from 'faker';
import { generateFakeUsers } from '../utils';

beforeAll(async () => await db.migrate.latest({ directory: 'src/db/migrations' }));
beforeEach(async () => await Promise.all([db.raw('TRUNCATE TABLE users CASCADE ')]));
afterAll(async () => await db.destroy());

describe('User Registration', () => {
  // beforeEach(async () => await initializeTestingDB());

  test('Registering new user with existing email should return error', async () => {
    //// setup
    const users = generateFakeUsers(1, 123);
    await db('users').insert(users[0]);

    //// test
    const query = `
      mutation {
          registerUser(
            user:{
              first_name: "${users[0].first_name}", 
              last_name: "${users[0].last_name}", 
              email: "${users[0].email}",
              password: "${users[0].password}",
              org_id: "${faker.random.uuid()}"
            }
          ) {
            first_name
            last_name
            email
          }
        }
    `;

    const rootValue = {};
    const context = new MakeContext({ user: null });
    const result = await graphql(schema, query, rootValue, context);
    expect(result).toMatchSnapshot();
    expect(result.errors.length).toBeGreaterThanOrEqual(1);
    expect(
      find(result.errors, { message: 'This email address is already associated with an account.' })
    ).not.toBeUndefined();
  });

  test('password should be correctly encyrpted', async () => {
    const users = generateFakeUsers(1, 123);
    const query = `
        mutation {
            registerUser(
              user:{
                first_name: "${users[0].first_name}", 
                last_name: "${users[0].last_name}", 
                email: "${users[0].email}",
                password: "${users[0].password}",
                org_id: "${faker.random.uuid()}"
              }
            ) {
              first_name
              last_name
              email
            }
          }
      `;

    const rootValue = {};
    const context = new MakeContext({ user: null });
    await graphql(schema, query, rootValue, context);
    // Grab record from database
    const dbUserRecord = await db('users')
      .first()
      .where({ email: users[0].email });
    expect(dbUserRecord.password).not.toBeUndefined();
    expect(bcrypt.compareSync(users[0].password, dbUserRecord.password)).toBe(true);
  });

  test('new registrant emailVerified should default to false', async () => {
    const users = generateFakeUsers(1, 123);
    const org1 = faker.random.uuid();
    await db('organizations').insert({ id: org1, name: faker.company.companyName() });
    const query = `
        mutation {
            registerUser(
              user:{
                first_name: "${users[0].first_name}", 
                last_name: "${users[0].last_name}", 
                email: "${users[0].email}",
                password: "${users[0].password}",
                org_id: "${org1}"
              }
            ) {
              first_name
              last_name
              email
              email_verified
            }
          }
      `;

    const rootValue = {};
    const context = new MakeContext({ user: null });
    const result = await graphql(schema, query, rootValue, context);
    // console.log(JSON.stringify(result, null, '\t'));
    // expect(result.data).toMatchSnapshot();
    expect(result.data.registerUser.email_verified).toBe(false);
    // Grab record from database
    const dbUserRecord = await db('users')
      .first()
      .where({ email: users[0].email });
    expect(dbUserRecord.email_verified).toBe(false);
  });

  test('new Ambassador registration should insert default permission', async () => {
    const users = generateFakeUsers(1, 124);
    const org1 = faker.random.uuid();
    await db('organizations').insert({ id: org1, name: faker.company.companyName() });
    const query = `
        mutation {
            registerUser(
              user:{
                first_name: "${users[0].first_name}", 
                last_name: "${users[0].last_name}", 
                email: "${users[0].email}",
                password: "${users[0].password}",
                org_id: "${org1}"
              }
            ) {
              first_name
              last_name
              email
              email_verified
            }
          }
      `;

    const rootValue = {};
    const context = new MakeContext({ user: null });
    //eslint-disable-next-line no-unused-vars
    const result = await graphql(schema, query, rootValue, context);
    const dbUserPermissionRecord = await db('permissions')
      .first()
      .where({ email: users[0].email, org_id: org1 });
    expect(dbUserPermissionRecord).not.toBeUndefined();
    expect(dbUserPermissionRecord.permission).toBe('AMBASSADOR');
  });
});
