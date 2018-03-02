import { graphql } from 'graphql';
import db from '../db';
import schema from '../graphql/schema';
import faker from 'faker';
import MakeContext from '../Context';
import { find } from 'lodash';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
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

describe('login', () => {
  test('user can login via mutation', async () => {
    const users = generateFakeUsers(1, 1);
    // generate old password hash
    const passwordHash = bcrypt.hashSync(users[0].password, 10);
    await db('users').insert({ email: users[0].email, password: passwordHash });
    const org1 = faker.random.uuid();
    const org2 = faker.random.uuid();
    await db('organizations').insert({ id: org1, name: faker.company.companyName() });
    await db('organizations').insert({ id: org2, name: faker.company.companyName() });
    await db('permissions').insert({
      org_id: org1,
      email: users[0].email,
      permission: 'READ_ONLY',
    });
    await db('permissions').insert({
      org_id: org2,
      email: users[0].email,
      permission: 'ADMIN',
    });
    const tokenPayload = {
      email: users[0].email,
      permissions: {
        [org1]: ['READ_ONLY'],
        [org2]: ['ADMIN'],
      },
    };
    const query = `
        mutation {
            login(
              email: "${users[0].email}",
              password: "${users[0].password}"
            ) {
              userProfile {
                email
              }
              token
            }
          }
      `;
    const rootValue = {};
    const context = new MakeContext({ user: null });
    const result = await graphql(schema, query, rootValue, context);
    // console.log(JSON.stringify(result, null, '\t'));
    const decodedToken = jwt.verify(result.data.login.token, process.env.JWT_SECRET);
    expect(decodedToken.permissions).toEqual(tokenPayload.permissions);
    expect(decodedToken.email).toEqual(tokenPayload.email);
  });

  test('user can not log in with incorrect password', async () => {
    const users = generateFakeUsers(1, 21);
    // generate old password hash
    const passwordHash = bcrypt.hashSync(users[0].password, 10);
    await db('users').insert({ email: users[0].email, password: passwordHash });
    const query = `
        mutation {
            login(
              email: "${users[0].email}",
              password: "badpass"
            ) {
              userProfile {
                email
              }
              token
            }
          }
      `;
    const rootValue = {};
    const context = new MakeContext({ user: null });
    const result = await graphql(schema, query, rootValue, context);
    expect(result).toMatchSnapshot();
    expect(result.errors.length).toBeGreaterThanOrEqual(1);
    expect(find(result.errors, { message: 'User can not be authenticated.' })).not.toBeUndefined();
  });
});
