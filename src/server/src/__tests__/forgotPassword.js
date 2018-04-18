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
beforeEach(async () => await Promise.all([db.raw('TRUNCATE TABLE users CASCADE')]));
afterAll(async () => await db.destroy());

describe('Forgot Password', () => {
  test('mutation should trigger an email with a predictable link and JWT querystring', async () => {
    const sendEmail = jest.fn(() => Promise.resolve());
    const users = generateFakeUsers(1, 10);
    const resetPasswordToken = jwt.sign({ email: users[0].email }, process.env.JWT_SECRET);
    const base_url = 'https://facebook.com';
    const query = `
      mutation {
        sendPasswordResetEmail(email:"${users[0].email}", base_url: "${base_url}")
      }
    `;
    const rootValue = {};
    const context = new MakeContext({ user: null });
    context.connectors.sendEmail = sendEmail;
    await graphql(schema, query, rootValue, context);
    expect(sendEmail).toHaveBeenCalled();
    expect(sendEmail.mock.calls[0][0].to).toBe(users[0].email);
    expect(sendEmail.mock.calls[0][0].html).toEqual(
      expect.stringContaining(`${base_url}/auth/reset-password?token=${resetPasswordToken}`)
    );
    expect(sendEmail.mock.calls[0][0].txt).toEqual(
      expect.stringContaining(`${base_url}/auth/reset-password?token=${resetPasswordToken}`)
    );
  });

  test('mutation should change password', async () => {
    const users = generateFakeUsers(1, 11);
    const newPassword = faker.internet.password();
    // generate old password hash
    const oldPasswordHash = bcrypt.hashSync(users[0].password, 10);
    await db('users').insert({ email: users[0].email, password: oldPasswordHash });

    const emailVerificationToken = jwt.sign({ email: users[0].email }, process.env.JWT_SECRET);
    const query = `
      mutation {
        resetPassword(data:{
          token: "${emailVerificationToken}",
          newPassword: "${newPassword}"
        })
      }
    `;
    const rootValue = {};
    const context = new MakeContext({ user: null });
    await graphql(schema, query, rootValue, context);
    const dbUserRecord = await db('users')
      .first()
      .where({ email: users[0].email });
    expect(bcrypt.compareSync(newPassword, dbUserRecord.password)).toBe(true);
  });

  test('it should fail if token is bad', async () => {
    const users = generateFakeUsers(1, 12);
    const newPassword = faker.internet.password();
    // generate old password hash
    const oldPasswordHash = bcrypt.hashSync(users[0].password, 10);
    await db('users').insert({ email: users[0].email, password: oldPasswordHash });

    const passwordResetToken = jwt.sign({ email: users[0].email }, 'bad-secret');
    const query = `
      mutation {
        resetPassword(data:{
          token: "${passwordResetToken}",
          newPassword: "${newPassword}"
        })
      }
    `;
    const rootValue = {};
    const context = new MakeContext({ user: null });
    const result = await graphql(schema, query, rootValue, context);
    expect(result.errors.length).toBeGreaterThanOrEqual(1);
    expect(find(result.errors, { message: 'Invalid Token.' })).not.toBeUndefined();
  });
});
