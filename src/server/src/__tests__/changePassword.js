import { graphql } from 'graphql';
import db from '../db';
import schema from '../graphql/schema';
import faker from 'faker';
import MakeContext from '../Context';
import { find } from 'lodash';
import bcrypt from 'bcrypt';
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

describe('Change Password', () => {
  test('user can not change password with incorrect current password', async () => {
    const users = generateFakeUsers(1, 1);
    const newPassword = faker.internet.password();
    // generate old password hash
    const oldPasswordHash = bcrypt.hashSync(users[0].password, 10);
    await db('users').insert({ email: users[0].email, password: oldPasswordHash });

    const query = `
        mutation {
            changePassword(
              data:{
                currentPassword: "${users[0].password}Error",
                newPassword: "${newPassword}",
              }
            ) 
          }
      `;
    const rootValue = {};
    const context = new MakeContext({ user: { email: users[0].email } });
    // context.sendEmail = sendEmail;
    const result = await graphql(schema, query, rootValue, context);
    expect(result.errors.length).toBeGreaterThanOrEqual(1);
    expect(find(result.errors, { message: 'User can not be authenticated.' })).not.toBeUndefined();
  });

  test('user can change password', async () => {
    const users = generateFakeUsers(1, 9);
    const newPassword = faker.internet.password();
    // generate old password hash
    const oldPasswordHash = bcrypt.hashSync(users[0].password, 10);
    await db('users').insert({ email: users[0].email, password: oldPasswordHash });

    const query = `
        mutation {
            changePassword(
              data:{
                currentPassword: "${users[0].password}",
                newPassword: "${newPassword}",
              }
            ) 
          }
      `;
    const rootValue = {};
    const context = new MakeContext({ user: { email: users[0].email } });
    const result = await graphql(schema, query, rootValue, context);
    expect(result.data.changePassword).toBe('ok');
    const dbUserRecord = await db('users')
      .first()
      .where({ email: users[0].email });
    expect(bcrypt.compareSync(newPassword, dbUserRecord.password)).toBe(true);
  });
});
