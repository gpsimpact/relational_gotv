import { graphql } from 'graphql';
import db from '../db';
import schema from '../graphql/schema';
// import faker from 'faker';
import MakeContext from '../Context';
import { find } from 'lodash';
// import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { generateFakeUsers } from '../utils';

beforeAll(async () => await db.migrate.latest({ directory: 'src/db/migrations' }));
beforeEach(async () => await Promise.all([db.raw('TRUNCATE TABLE users CASCADE')]));
afterAll(async () => await db.destroy());

describe('email verification', () => {
  test('mutation should trigger an email with a predictable link and JWT token in querystring', async () => {
    const sendEmail = jest.fn(() => Promise.resolve());
    const users = generateFakeUsers(1, 1);
    const emailVerificationToken = jwt.sign({ email: users[0].email }, process.env.JWT_SECRET);
    const base_url = 'https://facebook.com';
    const query = `
      mutation {
        sendVerificationEmail(email:"${users[0].email}", base_url: "${base_url}")
      }
    `;
    const rootValue = {};
    const context = new MakeContext({ user: null });
    context.connectors.sendEmail = sendEmail;
    await graphql(schema, query, rootValue, context);
    expect(sendEmail).toHaveBeenCalled();
    expect(sendEmail.mock.calls[0][0].to).toBe(users[0].email);
    expect(sendEmail.mock.calls[0][0].html).toEqual(
      expect.stringContaining(`${base_url}/emailVerification?token=${emailVerificationToken}`)
    );
    expect(sendEmail.mock.calls[0][0].txt).toEqual(
      expect.stringContaining(`${base_url}/emailVerification?token=${emailVerificationToken}`)
    );
  });

  test('mutation should mark email as verified', async () => {
    const users = generateFakeUsers(1, 1);
    await db('users').insert({
      email: users[0].email,
      email_verified: false,
    });
    const emailVerificationToken = jwt.sign({ email: users[0].email }, process.env.JWT_SECRET);
    const query = `
      mutation {
        verifyEmailAddress(token:"${emailVerificationToken}")
      }
    `;
    const rootValue = {};
    const context = new MakeContext({ user: null });
    const result = await graphql(schema, query, rootValue, context);
    expect(result.data.verifyEmailAddress).toBe('ok');
    const dbUserRecord = await db('users')
      .first()
      .where({ email: users[0].email });
    expect(dbUserRecord.email_verified).toBe(true);
  });

  test('it should fail if token is bad', async () => {
    const query = `
      mutation {
        verifyEmailAddress(token:"badToken.blergh")
      }
    `;
    const rootValue = {};
    const context = new MakeContext({ user: null });
    const result = await graphql(schema, query, rootValue, context);
    expect(result).toMatchSnapshot();
    expect(result.errors.length).toBeGreaterThanOrEqual(1);
    expect(find(result.errors, { message: 'Invalid Token.' })).not.toBeUndefined();
  });
});
