import { graphql } from 'graphql';
import db from '../db';
import schema from '../graphql/schema';
import faker from 'faker';
import MakeContext from '../Context';
import { find } from 'lodash';
// import bcrypt from 'bcrypt';
// import jwt from 'jsonwebtoken';
import {
  generateFakePVs,
  generateFakeUsers,
  // generateFakeTasks,
  generateFakeVoters,
} from '../utils';

beforeAll(async () => await db.migrate.latest({ directory: 'src/db/migrations' }));
beforeEach(
  async () =>
    await Promise.all([
      db.raw('TRUNCATE TABLE users CASCADE'),
      db.raw('TRUNCATE TABLE organizations CASCADE'),
      db.raw('TRUNCATE TABLE potential_voters CASCADE'),
      db.raw('TRUNCATE TABLE voter_file CASCADE'),
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
    const userPerms = {
      [org1.id]: ['AMBASSADOR'],
    };
    const query = `
      query {
          potentialVoters(
            where: {
              org_id_is: "${org1.id}"
            } 
          ) {
            items {
              first_name
              last_name
              city
              user_email
              org_id
            }
          }
        }
    `;
    const rootValue = {};
    const context = new MakeContext({ user: { email: users[0].email, permissions: userPerms } });
    const result = await graphql(schema, query, rootValue, context);
    expect(result.data.potentialVoters.items.length).toBe(pvs.length);
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
          potentialVoters(
            where: {
              org_id_is: "${org1.id}"
            }
          ) {
            items {
              first_name
              last_name
              city
              user_email
              org_id
            }
          }
        }
    `;
    const rootValue = {};
    const context = new MakeContext({ user: { email: users[0].email, permissions: userPerms } });
    const result = await graphql(schema, query, rootValue, context);
    // console.log(JSON.stringify(result, null, '\t'));
    expect(result.data.potentialVoters.items.length).toBe(0);
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
          }
        }
    `;
    const rootValue = {};
    const context = new MakeContext({ user: { email: users[0].email, permissions: userPerms } });
    const result = await graphql(schema, query, rootValue, context);
    // console.log(JSON.stringify(result, null, '\t'));
    expect(find(result.errors, { message: 'Insufficient permissions.' })).not.toBeUndefined();
  });

  test('user can modify a PV', async () => {
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
          updatePotentialVoter(
            id: "${pvs[0].id}" 
            data: {
              first_name: "Billiam"
            }
          ) {
            id
            first_name
            last_name
            city
            user_email
            org_id
          }
        }
    `;
    const rootValue = {};
    const context = new MakeContext({ user: { email: users[0].email, permissions: userPerms } });
    const results = await graphql(schema, query, rootValue, context);
    // console.log(JSON.stringify(results, null, '\t'));
    expect(results.data.updatePotentialVoter.first_name).toBe('Billiam');
    const dbPVs = await db('potential_voters')
      .where({
        id: pvs[0].id,
      })
      .first();
    expect(dbPVs.first_name).toBe('Billiam');
    expect(dbPVs.last_name).toBe(pvs[0].last_name);
  });

  test('user can mark a PV as deleted', async () => {
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
          updatePotentialVoter(
            id: "${pvs[0].id}" 
            data: {
              deleted: true
            }
          ) {
            id
            first_name
            last_name
            city
            user_email
            org_id
          }
        }
    `;
    const rootValue = {};
    const context = new MakeContext({ user: { email: users[0].email, permissions: userPerms } });
    //eslint-disable-next-line no-unused-vars
    const results = await graphql(schema, query, rootValue, context);
    // console.log(JSON.stringify(results, null, '\t'));
    const dbPVs = await db('potential_voters')
      .where({
        id: pvs[0].id,
      })
      .first();
    expect(dbPVs.deleted).toBe(true);
  });

  test('user can NOT modify a PV not assigned to them.', async () => {
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
          updatePotentialVoter(
            id: "${pvs[0].id}" 
            data: {
              first_name: "Billiam"
            }
          ) {
            id
            first_name
            last_name
            city
            user_email
            org_id
          }
        }
    `;
    const rootValue = {};
    const context = new MakeContext({
      user: { email: 'badEmail@foo.com', permissions: userPerms },
    });
    const results = await graphql(schema, query, rootValue, context);
    // console.log(JSON.stringify(results, null, '\t'));
    expect(find(results.errors, { message: 'Insufficient permissions.' })).not.toBeUndefined();
  });

  test('user can NOT modify a PV without ambassador permissions.', async () => {
    const users = generateFakeUsers(1, 1);
    const org1 = { id: faker.random.uuid(), name: faker.company.companyName() };
    const pvs = generateFakePVs(1, 11, users[0].email, org1.id);
    await db('users').insert(users[0]);
    await db('organizations').insert(org1);
    await db('potential_voters').insert(pvs);
    const userPerms = {
      [org1.id]: [],
    };
    const query = `
      mutation {
          updatePotentialVoter(
            id: "${pvs[0].id}" 
            data: {
              first_name: "Billiam"
            }
          ) {
            id
            first_name
            last_name
            city
            user_email
            org_id
          }
        }
    `;
    const rootValue = {};
    const context = new MakeContext({
      user: { email: users[0].email, permissions: userPerms },
    });
    const results = await graphql(schema, query, rootValue, context);
    expect(find(results.errors, { message: 'Insufficient permissions.' })).not.toBeUndefined();
  });

  test('User can query for a single PV', async () => {
    const users = generateFakeUsers(1, 1);
    const org1 = { id: faker.random.uuid(), name: faker.company.companyName() };
    const pvs = generateFakePVs(10, 11, users[0].email, org1.id);
    await db('users').insert(users[0]);
    await db('organizations').insert(org1);
    await db('potential_voters').insert(pvs);
    const userPerms = {
      [org1.id]: ['AMBASSADOR'],
    };
    const query = `
      query {
          potentialVoter(
            where: {
              id: "${pvs[0].id}"
            }
          ) {
            id
            first_name
            last_name
            city
            user_email
            org_id
          }
        }
    `;
    const rootValue = {};
    const context = new MakeContext({ user: { email: users[0].email, permissions: userPerms } });
    const result = await graphql(schema, query, rootValue, context);
    // console.log(JSON.stringify(result, null, '\t'));
    expect(result.data.potentialVoter).toEqual(pvs[0]);
  });

  test('User can query for a single PV including voter data', async () => {
    const users = generateFakeUsers(1, 1);
    const org1 = { id: faker.random.uuid(), name: faker.company.companyName() };
    const pvs = generateFakePVs(1, 11, users[0].email, org1.id);
    const voters = generateFakeVoters(1, 133);
    await db('voter_file').insert(voters);
    // associate voter id with pv
    pvs[0].state_file_id = voters[0].state_file_id;
    await db('users').insert(users[0]);
    await db('organizations').insert(org1);
    await db('potential_voters').insert(pvs);

    const userPerms = {
      [org1.id]: ['AMBASSADOR'],
    };
    const query = `
      query {
          potentialVoter(
            where: {
              id: "${pvs[0].id}"
            }
          ) {
            id
            first_name
            last_name
            city
            user_email
            org_id
            voterFileRecord {
              state_file_id
              first_name
            }
          }
        }
    `;
    const rootValue = {};
    const context = new MakeContext({ user: { email: users[0].email, permissions: userPerms } });
    const result = await graphql(schema, query, rootValue, context);
    expect(result.data.potentialVoter.voterFileRecord.id).toEqual(voters[0].id);
    expect(result.data.potentialVoter.voterFileRecord.first_name).toEqual(voters[0].first_name);
  });

  test('User cant query for a single PV if its not assigned to their email', async () => {
    const users = generateFakeUsers(2, 1);
    const org1 = { id: faker.random.uuid(), name: faker.company.companyName() };
    const pvs = generateFakePVs(10, 11, users[1].email, org1.id);
    await db('users').insert(users);
    await db('organizations').insert(org1);
    await db('potential_voters').insert(pvs);
    const userPerms = {
      [org1.id]: ['AMBASSADOR'],
    };
    const query = `
      query {
          potentialVoter(
            where: {
              id: "${pvs[0].id}"
            }
          ) {
            id
            first_name
            last_name
            city
            user_email
            org_id
          }
        }
    `;
    const rootValue = {};
    const context = new MakeContext({ user: { email: users[0].email, permissions: userPerms } });
    const result = await graphql(schema, query, rootValue, context);
    // console.log(JSON.stringify(result, null, '\t'));
    expect(find(result.errors, { message: 'Insufficient permissions.' })).not.toBeUndefined();
  });

  test('User cant query for a single PV without ambassador permissions', async () => {
    const users = generateFakeUsers(2, 1);
    const org1 = { id: faker.random.uuid(), name: faker.company.companyName() };
    const pvs = generateFakePVs(10, 11, users[0].email, org1.id);
    await db('users').insert(users);
    await db('organizations').insert(org1);
    await db('potential_voters').insert(pvs);
    const userPerms = {
      [org1.id]: [],
    };
    const query = `
      query {
          potentialVoter(
            where: {
              id: "${pvs[0].id}"
            }
          ) {
            id
            first_name
            last_name
            city
            user_email
            org_id
          }
        }
    `;
    const rootValue = {};
    const context = new MakeContext({ user: { email: users[0].email, permissions: userPerms } });
    const result = await graphql(schema, query, rootValue, context);
    expect(find(result.errors, { message: 'Insufficient permissions.' })).not.toBeUndefined();
  });

  test('PV query returns task object', async () => {
    const users = generateFakeUsers(1, 1);
    const org1 = { id: faker.random.uuid(), name: faker.company.companyName() };
    const pvs = generateFakePVs(1, 11, users[0].email, org1.id);
    const tasks = [
      {
        id: faker.random.uuid(),
        form_schema: JSON.stringify({}),
        pv_id: pvs[0].id,
        form_data: JSON.stringify({}),
        point_value: faker.random.number(),
        status: 'COMPLETE',
        sequence: 1,
        description: faker.commerce.productName(),
      },
      {
        id: faker.random.uuid(),
        form_schema: JSON.stringify({}),
        pv_id: pvs[0].id,
        form_data: JSON.stringify({}),
        point_value: faker.random.number(),
        status: 'INCOMPLETE',
        sequence: 2,
        description: faker.commerce.productName(),
      },
    ];
    await db('users').insert(users[0]);
    await db('organizations').insert(org1);
    await db('potential_voters').insert(pvs);
    await db('tasks').insert(tasks);
    const userPerms = {
      [org1.id]: ['AMBASSADOR'],
    };
    const query = `
      query {
          potentialVoter(
            where: {
              id: "${pvs[0].id}"
            }
          ) {
            nextTask {
              id
              form_schema
              form_data
              point_value
              status
              sequence
              description
            }
          }
        }
    `;
    const rootValue = {};
    const context = new MakeContext({ user: { email: users[0].email, permissions: userPerms } });
    const result = await graphql(schema, query, rootValue, context);
    // console.log(JSON.stringify(result, null, '\t'));
    expect(result.data.potentialVoter.nextTask.id).toBe(tasks[1].id);
  });

  test('PV query returns task counts', async () => {
    const users = generateFakeUsers(1, 1);
    const org1 = { id: faker.random.uuid(), name: faker.company.companyName() };
    const pvs = generateFakePVs(1, 11, users[0].email, org1.id);
    const tasks = [
      {
        id: faker.random.uuid(),
        form_schema: JSON.stringify({}),
        pv_id: pvs[0].id,
        form_data: JSON.stringify({}),
        point_value: faker.random.number(),
        status: 'COMPLETE',
        sequence: 1,
        description: faker.commerce.productName(),
      },
      {
        id: faker.random.uuid(),
        form_schema: JSON.stringify({}),
        pv_id: pvs[0].id,
        form_data: JSON.stringify({}),
        point_value: faker.random.number(),
        status: 'COMPLETE',
        sequence: 2,
        description: faker.commerce.productName(),
      },
      {
        id: faker.random.uuid(),
        form_schema: JSON.stringify({}),
        pv_id: pvs[0].id,
        form_data: JSON.stringify({}),
        point_value: faker.random.number(),
        status: 'INCOMPLETE',
        sequence: 1,
        description: faker.commerce.productName(),
      },
    ];
    await db('users').insert(users[0]);
    await db('organizations').insert(org1);
    await db('potential_voters').insert(pvs);
    await db('tasks').insert(tasks);
    const userPerms = {
      [org1.id]: ['AMBASSADOR'],
    };
    const query = `
      query {
          potentialVoter(
            where: {
              id: "${pvs[0].id}"
            }
          ) {
            countCompletedTasks
            countAvailableTasks
          }
        }
    `;
    const rootValue = {};
    const context = new MakeContext({ user: { email: users[0].email, permissions: userPerms } });
    const result = await graphql(schema, query, rootValue, context);
    // console.log(JSON.stringify(result, null, '\t'));
    expect(result.data.potentialVoter.countCompletedTasks).toBe(2);
    expect(result.data.potentialVoter.countAvailableTasks).toBe(1);
  });

  test('PV query returns points fields', async () => {
    const users = generateFakeUsers(1, 1);
    const org1 = { id: faker.random.uuid(), name: faker.company.companyName() };
    const pvs = generateFakePVs(1, 11, users[0].email, org1.id);
    const voters = generateFakeVoters(1, 133);
    // specify test voter condition. should equal 20 + 20 (not 100)
    voters[0].vo_ab_requested_primary = true;
    voters[0].vo_voted_primary = false;
    voters[0].vo_ab_requested_general = true;
    voters[0].vo_voted_general = false;
    await db('voter_file').insert(voters);
    pvs[0].state_file_id = voters[0].state_file_id;
    const tasks = [
      {
        id: faker.random.uuid(),
        form_schema: JSON.stringify({}),
        pv_id: pvs[0].id,
        form_data: JSON.stringify({}),
        point_value: 21,
        status: 'COMPLETE',
        sequence: 1,
        description: faker.commerce.productName(),
      },
      {
        id: faker.random.uuid(),
        form_schema: JSON.stringify({}),
        pv_id: pvs[0].id,
        form_data: JSON.stringify({}),
        point_value: 42,
        status: 'COMPLETE',
        sequence: 2,
        description: faker.commerce.productName(),
      },
      {
        id: faker.random.uuid(),
        form_schema: JSON.stringify({}),
        pv_id: pvs[0].id,
        form_data: JSON.stringify({}),
        point_value: faker.random.number(),
        status: 'INCOMPLETE',
        sequence: 1,
        description: faker.commerce.productName(),
      },
    ];
    await db('users').insert(users[0]);
    await db('organizations').insert(org1);
    await db('potential_voters').insert(pvs);
    await db('tasks').insert(tasks);
    const userPerms = {
      [org1.id]: ['AMBASSADOR'],
    };
    const query = `
      query {
          potentialVoter(
            where: {
              id: "${pvs[0].id}"
            }
          ) {
            voPoints
            taskPoints
          }
        }
    `;
    const rootValue = {};
    const context = new MakeContext({ user: { email: users[0].email, permissions: userPerms } });
    const result = await graphql(schema, query, rootValue, context);
    // console.log(JSON.stringify(result, null, '\t'));
    expect(result.data.potentialVoter.voPoints).toBe(60);
    expect(result.data.potentialVoter.taskPoints).toBe(63);
  });
});
