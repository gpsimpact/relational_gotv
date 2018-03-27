import { graphql } from 'graphql';
import db from '../db';
import schema from '../graphql/schema';
import faker from 'faker';
import MakeContext from '../Context';
import { find } from 'lodash';
import { generateFakeUsers, generateFakeVoters } from '../utils';

beforeAll(async () => await db.migrate.latest({ directory: 'src/db/migrations' }));
beforeEach(
  async () =>
    await Promise.all([
      db.raw('TRUNCATE TABLE voter_file CASCADE'),
      db.raw('TRUNCATE TABLE users CASCADE'),
      db.raw('TRUNCATE TABLE organizations CASCADE'),
    ])
);
afterAll(async () => await db.destroy());

describe('Voter File', () => {
  test('user can query for voters', async () => {
    const users = generateFakeUsers(1, 1);
    const org1 = { id: faker.random.uuid(), name: faker.company.companyName() };
    const voters = [
      { state_file_id: 'alpha', first_name: 'alpha', last_name: 'alpha', city: 'alpha' },
      { state_file_id: 'beta', first_name: 'beta', last_name: 'beta', city: 'beta' },
      { state_file_id: 'charlie', first_name: 'charlie', last_name: 'charlie', city: 'charlie' },
      { state_file_id: 'delta', first_name: 'delta', last_name: 'delta', city: 'delta' },
      { state_file_id: 'echo', first_name: 'echo', last_name: 'echo', city: 'echo' },
      { state_file_id: 'foxtrot', first_name: 'foxtrot', last_name: 'foxtrot', city: 'foxtrot' },
      { state_file_id: 'golf', first_name: 'golf', last_name: 'golf', city: 'golf' },
      { state_file_id: 'hotel', first_name: 'hotel', last_name: 'hotel', city: 'hotel' },
      { state_file_id: 'india', first_name: 'india', last_name: 'india', city: 'india' },
      { state_file_id: 'juliet', first_name: 'juliet', last_name: 'juliet', city: 'juliet' },
    ];
    await db('users').insert(users[0]);
    await db('organizations').insert(org1);
    await db('voter_file').insert(voters);
    const userPerms = {
      [org1.id]: ['AMBASSADOR'],
    };
    const query = `
      query {
          voters(
            orderBy: [{sort: first_name, direction: ASC}, {sort:last_name, direction: DESC}],
            limit: 2
          ) {
            items {
              state_file_id
              first_name
              last_name
              city
            },
            response_metadata {
              next_cursor
            }
          }
        }
    `;
    const rootValue = {};
    const context = new MakeContext({ user: { email: users[0].email, permissions: userPerms } });
    const result = await graphql(schema, query, rootValue, context);
    // console.log(JSON.stringify(result, null, '\t'));
    expect(result.data.voters.items.length).toBeGreaterThanOrEqual(1);
    expect(result.data.voters.items[0]).toEqual(voters[0]);
    expect(result.data.voters.response_metadata.next_cursor).not.toBeUndefined();
  });

  test.only('cursor pagination works as expected', async () => {
    const users = generateFakeUsers(1, 1);
    const org1 = { id: faker.random.uuid(), name: faker.company.companyName() };
    const voters = [
      { state_file_id: 'alpha', first_name: 'alpha', last_name: 'alpha', city: 'alpha' },
      { state_file_id: 'beta', first_name: 'beta', last_name: 'beta', city: 'beta' },
      { state_file_id: 'charlie', first_name: 'charlie', last_name: 'charlie', city: 'charlie' },
      { state_file_id: 'delta', first_name: 'delta', last_name: 'delta', city: 'delta' },
      { state_file_id: 'echo', first_name: 'echo', last_name: 'echo', city: 'echo' },
      { state_file_id: 'foxtrot', first_name: 'foxtrot', last_name: 'foxtrot', city: 'foxtrot' },
      { state_file_id: 'golf', first_name: 'golf', last_name: 'golf', city: 'golf' },
      { state_file_id: 'hotel', first_name: 'hotel', last_name: 'hotel', city: 'hotel' },
      { state_file_id: 'india', first_name: 'india', last_name: 'india', city: 'india' },
      { state_file_id: 'juliet', first_name: 'juliet', last_name: 'juliet', city: 'juliet' },
    ];
    await db('users').insert(users[0]);
    await db('organizations').insert(org1);
    await db('voter_file').insert(voters);
    const userPerms = {
      [org1.id]: ['AMBASSADOR'],
    };
    const query = `
      query {
          voters(
            after: "eyJvcmRlckJ5IjpbeyJzb3J0IjoiZmlyc3RfbmFtZSIsImRpcmVjdGlvbiI6IkFTQyJ9LHsic29ydCI6Imxhc3RfbmFtZSIsImRpcmVjdGlvbiI6IkRFU0MifSx7InNvcnQiOiJzdGF0ZV9maWxlX2lkIiwiZGlyZWN0aW9uIjoiQVNDIn1dLCJ2YWx1ZXMiOlsiY2hhcmxpZSIsImNoYXJsaWUiLCJjaGFybGllIl19",
            limit: 2
          ) {
            items {
              state_file_id
              first_name
              last_name
              city
            },
            response_metadata {
              next_cursor
            }
          }
        }
    `;
    const rootValue = {};
    const context = new MakeContext({ user: { email: users[0].email, permissions: userPerms } });
    const result = await graphql(schema, query, rootValue, context);
    console.log(JSON.stringify(result, null, '\t'));
    expect(result.data.voters.items.length).toBeGreaterThanOrEqual(1);
    expect(result.data.voters.items[0]).toEqual(voters[2]);
    expect(result.data.voters.response_metadata.next_cursor).not.toBeUndefined();
  });
});
