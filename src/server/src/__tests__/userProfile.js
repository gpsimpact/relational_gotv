import { graphql } from 'graphql';
import db from '../db';
import schema from '../graphql/schema';
// import faker from 'faker';
import MakeContext from '../Context';
// import { find } from 'lodash';
// import bcrypt from 'bcrypt';
// import jwt from 'jsonwebtoken';
import { generateFakeUsers } from '../utils';

beforeAll(async () => await db.migrate.latest({ directory: 'src/db/migrations' }));
beforeEach(async () => await Promise.all([db.raw('TRUNCATE TABLE users CASCADE')]));
afterAll(async () => await db.destroy());

describe('User Profile', () => {
  test('user can fully update profile', async () => {
    const users = generateFakeUsers(2, 14);
    await db('users').insert(users[0]);
    const query = `
      mutation {
          updateProfile(
            data:{
              first_name: "${users[1].first_name}", 
              last_name: "${users[1].last_name}", 
            }
          ) {
            first_name
            last_name
            email
          }
        }
    `;
    const rootValue = {};
    const context = new MakeContext({ user: { email: users[0].email } });
    const result = await graphql(schema, query, rootValue, context);
    // console.log(JSON.stringify(result, null, '\t'));
    expect(result.data.updateProfile.first_name).toBe(users[1].first_name);
    expect(result.data.updateProfile.last_name).toBe(users[1].last_name);
    expect(result.data.updateProfile.email).toBe(users[0].email);
    const dbUserRecord = await db('users')
      .first()
      .where({ email: users[0].email });
    expect(dbUserRecord.first_name).toBe(users[1].first_name);
    expect(dbUserRecord.last_name).toBe(users[1].last_name);
    expect(dbUserRecord.email).toBe(users[0].email);
  });

  test('user can partially update profile', async () => {
    const users = generateFakeUsers(2, 1);
    await db('users').insert(users[0]);
    const query = `
      mutation {
          updateProfile(
            data:{
              last_name: "${users[1].last_name}", 
            }
          ) {
            first_name
            last_name
            email
          }
        }
    `;
    const rootValue = {};
    const context = new MakeContext({ user: { email: users[0].email } });
    const result = await graphql(schema, query, rootValue, context);
    expect(result.data.updateProfile.first_name).toBe(users[0].first_name);
    expect(result.data.updateProfile.last_name).toBe(users[1].last_name);
    expect(result.data.updateProfile.email).toBe(users[0].email);
    const dbUserRecord = await db('users')
      .first()
      .where({ email: users[0].email });
    expect(dbUserRecord.first_name).toBe(users[0].first_name);
    expect(dbUserRecord.last_name).toBe(users[1].last_name);
    expect(dbUserRecord.email).toBe(users[0].email);
  });
});
