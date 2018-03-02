import { graphql } from 'graphql';
import db from '../db';
import schema from '../graphql/schema';
import faker from 'faker';
import MakeContext from '../Context';
import { find } from 'lodash';
// import bcrypt from 'bcrypt';
// import jwt from 'jsonwebtoken';
import { generateFakePVs, generateFakeUsers } from '../utils';

beforeAll(async () => await db.migrate.latest({ directory: 'src/db/migrations' }));
beforeEach(
  async () =>
    await Promise.all([
      db.raw('TRUNCATE TABLE users CASCADE'),
      db.raw('TRUNCATE TABLE organizations CASCADE'),
      db.raw('TRUNCATE TABLE potential_voters CASCADE'),
    ])
);
afterAll(async () => await db.destroy());

describe('Potential Voters', () => {
  test('user can query for their PVs', async () => {
    const users = generateFakeUsers(1, 1);
    const org1 = { id: faker.random.uuid(), name: faker.company.companyName() };
    const pvs = generateFakePVs(10, 11, users[0].email, org1.id);
    await db('users').insert(users[0]);
    await db('organizations').insert(org1);
    await db('potential_voters').insert(pvs);
    // await db('permissions').insert({
    //   org_id: org1.id,
    //   email: users[0].email,
    //   permission: 'AMBASSADOR',
    // });
    const userPerms = {
      [org1.id]: ['AMBASSADOR'],
    };
    const query = `
      query {
          myPotentialVoters(
            org_id: "${org1.id}"
          ) {
            first_name
            last_name
            city
            user_email
            org_id
            state_file_id
            vo_ab_requested
            vo_ab_requested_iso8601
            vo_voted
            vo_voted_iso8601
            vo_voted_method
          }
        }
    `;
    const rootValue = {};
    const context = new MakeContext({ user: { email: users[0].email, permissions: userPerms } });
    const result = await graphql(schema, query, rootValue, context);
    expect(result.data.myPotentialVoters.length).toBe(pvs.length);
  });

  test('user without ambassador permissions can not query for their PVS', async () => {
    const users = generateFakeUsers(1, 1);
    const org1 = { id: faker.random.uuid(), name: faker.company.companyName() };
    const pvs = generateFakePVs(10, 11, users[0].email, org1.id);
    await db('users').insert(users[0]);
    await db('organizations').insert(org1);
    await db('potential_voters').insert(pvs);
    const userPerms = {
      [org1.id]: [],
    };
    const query = `
      query {
          myPotentialVoters(
            org_id: "${org1.id}"
          ) {
            first_name
            last_name
            city
            user_email
            org_id
            state_file_id
            vo_ab_requested
            vo_ab_requested_iso8601
            vo_voted
            vo_voted_iso8601
            vo_voted_method
          }
        }
    `;
    const rootValue = {};
    const context = new MakeContext({ user: { email: users[0].email, permissions: userPerms } });
    const result = await graphql(schema, query, rootValue, context);
    expect(find(result.errors, { message: 'Insufficient permissions.' })).not.toBeUndefined();
  });

  test('user can create a new pv', async () => {
    const users = generateFakeUsers(1, 1);
    const org1 = { id: faker.random.uuid(), name: faker.company.companyName() };
    const pvs = generateFakePVs(1, 11, users[0].email, org1.id);
    await db('users').insert(users[0]);
    await db('organizations').insert(org1);
    const userPerms = {
      [org1.id]: ['AMBASSADOR'],
    };
    const query = `
      mutation {
          createPotentialVoter(
            data: {
              first_name: "${pvs[0].first_name}",
              last_name: "${pvs[0].last_name}",
              city: "${pvs[0].city}",
              org_id: "${org1.id}"
            }
          ) {
            id
            first_name
            last_name
            city
            user_email
            org_id
            state_file_id
            vo_ab_requested
            vo_ab_requested_iso8601
            vo_voted
            vo_voted_iso8601
            vo_voted_method
          }
        }
    `;
    const rootValue = {};
    const context = new MakeContext({ user: { email: users[0].email, permissions: userPerms } });
    await graphql(schema, query, rootValue, context);
    // console.log(JSON.stringify(result, null, '\t'));
    const dbPVs = await db('potential_voters')
      .where({
        first_name: pvs[0].first_name,
        last_name: pvs[0].last_name,
        city: pvs[0].city,
      })
      .first();
    expect(dbPVs).not.toBeUndefined();
  });

  test('user can not add pv without ambassador permission', async () => {
    const users = generateFakeUsers(1, 1);
    const org1 = { id: faker.random.uuid(), name: faker.company.companyName() };
    const pvs = generateFakePVs(1, 11, users[0].email, org1.id);
    await db('users').insert(users[0]);
    await db('organizations').insert(org1);
    const userPerms = {
      [org1.id]: [],
    };
    const query = `
      mutation {
          createPotentialVoter(
            data: {
              first_name: "${pvs[0].first_name}",
              last_name: "${pvs[0].last_name}",
              city: "${pvs[0].city}",
              org_id: "${org1.id}"
            }
          ) {
            id
            first_name
            last_name
            city
            user_email
            org_id
            state_file_id
            vo_ab_requested
            vo_ab_requested_iso8601
            vo_voted
            vo_voted_iso8601
            vo_voted_method
          }
        }
    `;
    const rootValue = {};
    const context = new MakeContext({ user: { email: users[0].email, permissions: userPerms } });
    const result = await graphql(schema, query, rootValue, context);
    // console.log(JSON.stringify(result, null, '\t'));
    expect(find(result.errors, { message: 'Insufficient permissions.' })).not.toBeUndefined();
  });

  test('calling create mutation while providing ID updates instead of inserts', async () => {
    const users = generateFakeUsers(1, 1);
    const org1 = { id: faker.random.uuid(), name: faker.company.companyName() };
    const pvs = generateFakePVs(1, 11, users[0].email, org1.id);
    await db('users').insert(users[0]);
    await db('organizations').insert(org1);
    await db('potential_voters').insert(pvs);
    const userPerms = {
      [org1.id]: ['AMBASSADOR'],
    };
    const query = `
      mutation {
          createPotentialVoter(
            data: {
              id: "${pvs[0].id}"
              first_name: "Billiam"
            }
          ) {
            id
            first_name
            last_name
            city
            user_email
            org_id
            state_file_id
            vo_ab_requested
            vo_ab_requested_iso8601
            vo_voted
            vo_voted_iso8601
            vo_voted_method
          }
        }
    `;
    const rootValue = {};
    const context = new MakeContext({ user: { email: users[0].email, permissions: userPerms } });
    const results = await graphql(schema, query, rootValue, context);
    // console.log(JSON.stringify(results, null, '\t'));
    expect(results.data.createPotentialVoter.first_name).toBe('Billiam');
    const dbPVs = await db('potential_voters')
      .where({
        id: pvs[0].id,
      })
      .first();
    expect(dbPVs.first_name).toBe('Billiam');
    expect(dbPVs.last_name).toBe(pvs[0].last_name);
  });

  test('above, but user can not not update id, org_id, or user_email', async () => {
    const users = generateFakeUsers(1, 1);
    const org1 = { id: faker.random.uuid(), name: faker.company.companyName() };
    const pvs = generateFakePVs(1, 11, users[0].email, org1.id);
    await db('users').insert(users[0]);
    await db('organizations').insert(org1);
    await db('potential_voters').insert(pvs);
    const userPerms = {
      [org1.id]: ['AMBASSADOR'],
    };
    const query = `
      mutation {
          createPotentialVoter(
            data: {
              id: "${pvs[0].id}"
              first_name: "Billiam",
              org_id: "nonsense",
              user_email: "bunk"
            }
          ) {
            id
            first_name
            last_name
            city
            user_email
            org_id
            state_file_id
            vo_ab_requested
            vo_ab_requested_iso8601
            vo_voted
            vo_voted_iso8601
            vo_voted_method
          }
        }
    `;
    const rootValue = {};
    const context = new MakeContext({ user: { email: users[0].email, permissions: userPerms } });
    const results = await graphql(schema, query, rootValue, context);
    // console.log(JSON.stringify(results, null, '\t'));
    expect(results.data.createPotentialVoter.first_name).toBe('Billiam');
    const dbPVs = await db('potential_voters')
      .where({
        id: pvs[0].id,
      })
      .first();
    expect(dbPVs.first_name).toBe('Billiam');
    expect(dbPVs.last_name).toBe(pvs[0].last_name);
    expect(dbPVs.user_email).toBe(pvs[0].user_email);
    expect(dbPVs.org_id).toBe(pvs[0].org_id);
  });

  test('must pas either ID or email and org to mutate', async () => {
    const users = generateFakeUsers(1, 1);
    const org1 = { id: faker.random.uuid(), name: faker.company.companyName() };
    const pvs = generateFakePVs(1, 11, users[0].email, org1.id);
    await db('users').insert(users[0]);
    await db('organizations').insert(org1);
    await db('potential_voters').insert(pvs);
    const userPerms = {
      [org1.id]: ['AMBASSADOR'],
    };
    const query = `
      mutation {
          createPotentialVoter(
            data: {
              first_name: "Billiam",
            }
          ) {
            id
            first_name
            last_name
            city
            user_email
            org_id
            state_file_id
            vo_ab_requested
            vo_ab_requested_iso8601
            vo_voted
            vo_voted_iso8601
            vo_voted_method
          }
        }
    `;
    const rootValue = {};
    const context = new MakeContext({ user: { email: users[0].email, permissions: userPerms } });
    const results = await graphql(schema, query, rootValue, context);
    // console.log(JSON.stringify(results, null, '\t'));
    expect(
      find(results.errors, {
        message:
          'You must provide either an id to update or user_email + org_id to create new potential voter.',
      })
    ).not.toBeUndefined();
  });
});
