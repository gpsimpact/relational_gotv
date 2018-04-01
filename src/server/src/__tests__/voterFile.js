import { graphql } from 'graphql';
import db from '../db';
import schema from '../graphql/schema';
import faker from 'faker';
import MakeContext from '../Context';
import { find } from 'lodash';
import redisDb from '../redisClient';
import { generateFakeUsers, generateFakeVoters } from '../utils';

beforeAll(async () => await db.migrate.latest({ directory: 'src/db/migrations' }));
beforeEach(
  async () =>
    await Promise.all([
      db.raw('TRUNCATE TABLE voter_file CASCADE'),
      db.raw('TRUNCATE TABLE users CASCADE'),
      db.raw('TRUNCATE TABLE organizations CASCADE'),
      redisDb.flushallAsync(),
    ])
);
afterAll(async () => await db.destroy());

describe('Voter File', () => {
  test('user can query for voters', async () => {
    const users = generateFakeUsers(1, 1);
    const org1 = { id: faker.random.uuid(), name: faker.company.companyName() };
    const voters = generateFakeVoters(100, 133);
    await db('users').insert(users[0]);
    await db('organizations').insert(org1);
    await db('voter_file').insert(voters);
    const userPerms = {
      [org1.id]: ['AMBASSADOR'],
    };
    const query = `
      query {
          voters(
            where: {
              first_name_starts_with: "${voters[0].first_name.charAt(0)}",
              last_name_starts_with: "${voters[0].last_name}",
              city_starts_with: "${voters[0].city}",
              state_is: "${voters[0].state}" 
            },
            orderBy: [{sort: first_name, direction: ASC}],
          ) {
            items {
              state_file_id
              first_name
              middle_name
              last_name
              home_address
              city
              state
              zipcode
              dob
              vo_ab_requested
              vo_ab_requested_date
              vo_voted
              vo_voted_date
              vo_voted_method
            },
            pageInfo {
              nextCursor
            }
          }
        }
    `;
    const rootValue = {};
    const context = new MakeContext({ user: { email: users[0].email, permissions: userPerms } });
    const result = await graphql(schema, query, rootValue, context);
    // console.log(JSON.stringify(result, null, '\t'));
    expect(result.data.voters.items.length).toBeGreaterThanOrEqual(1);
    expect(
      find(result.data.voters.items, { state_file_id: voters[0].state_file_id })
    ).not.toBeUndefined();
  });

  test('non auth user can NOT query for voters', async () => {
    // const users = generateFakeUsers(1, 1);
    // const org1 = { id: faker.random.uuid(), name: faker.company.companyName() };
    const voters = generateFakeVoters(100, 133);
    // await db('users').insert(users[0]);
    // await db('organizations').insert(org1);
    await db('voter_file').insert(voters);
    // const userPerms = {
    //   [org1.id]: ['AMBASSADOR'],
    // };
    const query = `
      query {
          voters(
            where: {
              first_name_starts_with: "${voters[0].first_name.charAt(0)}",
              last_name_starts_with: "${voters[0].last_name}",
              city_starts_with: "${voters[0].city}",
              state_is: "${voters[0].state}"
            }
          ) {
            items {
              state_file_id
              first_name
              middle_name
              last_name
              home_address
              city
              state
              zipcode
              dob
              vo_ab_requested
              vo_ab_requested_date
              vo_voted
              vo_voted_date
              vo_voted_method
            }
            pageInfo {
              nextCursor
            }
          }
        }
    `;
    const rootValue = {};
    const context = new MakeContext({ user: null });
    const result = await graphql(schema, query, rootValue, context);
    // console.log(JSON.stringify(result, null, '\t'));
    expect(find(result.errors, { message: 'Anonymous access is denied.' })).not.toBeUndefined();
  });

  test('user can query for a single voter', async () => {
    const users = generateFakeUsers(1, 1);
    const org1 = { id: faker.random.uuid(), name: faker.company.companyName() };
    const voters = generateFakeVoters(100, 133);
    // await db('users').insert(users[0]);
    // await db('organizations').insert(org1);
    await db('voter_file').insert(voters);
    const userPerms = {
      [org1.id]: ['AMBASSADOR'],
    };
    const query = `
      query {
          voter(
            where: {
              state_file_id: "${voters[0].state_file_id}",
            }
          ) {
            state_file_id
            first_name
            middle_name
            last_name
            home_address
            city
            state
            zipcode
            dob
            vo_ab_requested
            vo_ab_requested_date
            vo_voted
            vo_voted_date
            vo_voted_method
          }
        }
    `;
    const rootValue = {};
    const context = new MakeContext({ user: { email: users[0].email, permissions: userPerms } });
    const result = await graphql(schema, query, rootValue, context);
    // console.log(JSON.stringify(result, null, '\t'));
    expect(result.data.voter).toEqual(voters[0]);
  });

  test('user can NOT query without auth', async () => {
    const voters = generateFakeVoters(100, 133);
    await db('voter_file').insert(voters);

    const query = `
      query {
          voter(
            where: {
              state_file_id: "${voters[0].state_file_id}",
            }
          ) {
            state_file_id
            first_name
            middle_name
            last_name
            home_address
            city
            state
            zipcode
            dob
            vo_ab_requested
            vo_ab_requested_date
            vo_voted
            vo_voted_date
            vo_voted_method
          }
        }
    `;
    const rootValue = {};
    const context = new MakeContext({ user: null });
    const result = await graphql(schema, query, rootValue, context);
    // console.log(JSON.stringify(result, null, '\t'));
    expect(find(result.errors, { message: 'Anonymous access is denied.' })).not.toBeUndefined();
  });
});
