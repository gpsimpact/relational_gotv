import { graphql } from 'graphql';
import db from '../db';
import schema from '../graphql/schema';
import faker from 'faker';
import MakeContext from '../Context';
// import { find } from 'lodash';
// import bcrypt from 'bcrypt';
// import jwt from 'jsonwebtoken';
import { generateFakePVs, generateFakeUsers, generateFakeVoters } from '../utils';
import redisDb from '../redisClient';

beforeAll(async () => await db.migrate.latest({ directory: 'src/db/migrations' }));
beforeEach(
  async () =>
    await Promise.all([
      db.raw('TRUNCATE TABLE potential_voters CASCADE'),
      db.raw('TRUNCATE TABLE tasks CASCADE'),
      db.raw('TRUNCATE TABLE users CASCADE'),
      db.raw('TRUNCATE TABLE organizations CASCADE'),
      db.raw('TRUNCATE TABLE voter_file CASCADE'),
      redisDb.flushall(),
    ])
);
afterAll(async () => await db.destroy());

describe('Tasks', () => {
  test('point total scenario 1', async () => {
    const users = generateFakeUsers(1, 771);
    const org1 = { id: faker.random.uuid(), name: faker.company.companyName() };
    const pvs = generateFakePVs(1, 771, users[0].email, org1.id);
    const voters = [
      {
        state_file_id: 9988776655,
        vo_ab_requested_primary: true,
        vo_voted_primary: true,
        vo_ab_requested_general: true,
        vo_voted_general: true,
        propensity_score: 0,
      },
    ];
    pvs[0].state_file_id = voters[0].state_file_id;
    const tasks = [
      {
        id: faker.random.uuid(),
        form_schema: JSON.stringify({}),
        pv_id: pvs[0].id,
        form_data: JSON.stringify({}),
        point_value: 1,
        status: 'COMPLETE',
        sequence: 1,
        description: faker.commerce.productName(),
      },
      {
        id: faker.random.uuid(),
        form_schema: JSON.stringify({}),
        pv_id: pvs[0].id,
        form_data: JSON.stringify({}),
        point_value: 1,
        status: 'INCOMPLETE',
        sequence: 1,
        description: faker.commerce.productName(),
      },
    ];
    await db('users').insert(users[0]);
    await db('organizations').insert(org1);
    await db('potential_voters').insert(pvs);
    await db('tasks').insert(tasks);
    await db('voter_file').insert(voters);
    const userPerms = {
      [org1.id]: ['AMBASSADOR'],
    };
    const query = `
      query {
          points(
            where: {
              user_email_is: "${users[0].email}"
            }
          ) {
            items {
              organization {
                id
              }
              user {
                first_name
                last_name
                email
              }
              earned
              potential
            }
          }
        }
    `;
    const rootValue = {};
    const context = new MakeContext({ user: { email: users[0].email, permissions: userPerms } });
    const result = await graphql(schema, query, rootValue, context);
    expect(result).toMatchSnapshot();
    expect(result.data.points.items.length).toBe(1);
    expect(result.data.points.items).toContainEqual({
      organization: { id: org1.id },
      user: {
        first_name: users[0].first_name,
        last_name: users[0].last_name,
        email: users[0].email,
      },
      earned: 137,
      potential: 2,
    });
  });

  test('point total scenario 2', async () => {
    const users = generateFakeUsers(1, 771);
    const org1 = { id: faker.random.uuid(), name: faker.company.companyName() };
    const pvs = generateFakePVs(1, 771, users[0].email, org1.id);
    const voters = [
      {
        state_file_id: 9988776655,
        vo_ab_requested_primary: true,
        vo_voted_primary: false,
        vo_ab_requested_general: false,
        vo_voted_general: true,
        propensity_score: 3,
      },
    ];
    pvs[0].state_file_id = voters[0].state_file_id;
    const tasks = [
      {
        id: faker.random.uuid(),
        form_schema: JSON.stringify({}),
        pv_id: pvs[0].id,
        form_data: JSON.stringify({}),
        point_value: 1,
        status: 'COMPLETE',
        sequence: 1,
        description: faker.commerce.productName(),
      },
      {
        id: faker.random.uuid(),
        form_schema: JSON.stringify({}),
        pv_id: pvs[0].id,
        form_data: JSON.stringify({}),
        point_value: 1,
        status: 'INCOMPLETE',
        sequence: 1,
        description: faker.commerce.productName(),
      },
    ];
    await db('users').insert(users[0]);
    await db('organizations').insert(org1);
    await db('potential_voters').insert(pvs);
    await db('tasks').insert(tasks);
    await db('voter_file').insert(voters);
    const userPerms = {
      [org1.id]: ['AMBASSADOR'],
    };
    const query = `
      query {
          points(
            where: {
              user_email_is: "${users[0].email}"
            }
          ) {
            items {
              organization {
                id
              }
              user {
                first_name
                last_name
                email
              }
              earned
              potential
            }
          }
        }
    `;
    const rootValue = {};
    const context = new MakeContext({ user: { email: users[0].email, permissions: userPerms } });
    const result = await graphql(schema, query, rootValue, context);
    expect(result).toMatchSnapshot();
  });

  test('point total scenario 3', async () => {
    const users = generateFakeUsers(1, 771);
    const org1 = { id: faker.random.uuid(), name: faker.company.companyName() };
    const pvs = generateFakePVs(1, 771, users[0].email, org1.id);
    await db('users').insert(users[0]);
    await db('organizations').insert(org1);
    await db('potential_voters').insert(pvs);
    // await db('tasks').insert(tasks);
    // await db('voter_file').insert(voters);
    const userPerms = {
      [org1.id]: ['AMBASSADOR'],
    };
    const query = `
      query {
          points(
            where: {
              user_email_is: "${users[0].email}"
            }
          ) {
            items {
              organization {
                id
              }
              user {
                first_name
                last_name
                email
              }
              earned
              potential
            }
          }
        }
    `;
    const rootValue = {};
    const context = new MakeContext({ user: { email: users[0].email, permissions: userPerms } });
    const result = await graphql(schema, query, rootValue, context);
    expect(result).toMatchSnapshot();
  });

  test('non admin can only see their own email addy', async () => {
    const users = generateFakeUsers(2, 772);
    const org1 = { id: faker.random.uuid(), name: faker.company.companyName() };
    const pvs1 = generateFakePVs(1, 772, users[0].email, org1.id);
    const pvs2 = generateFakePVs(1, 773, users[1].email, org1.id);
    const tasks = [
      {
        id: faker.random.uuid(),
        form_schema: JSON.stringify({}),
        pv_id: pvs1[0].id,
        form_data: JSON.stringify({}),
        point_value: 101,
        status: 'COMPLETE',
        sequence: 1,
        description: faker.commerce.productName(),
      },
      {
        id: faker.random.uuid(),
        form_schema: JSON.stringify({}),
        pv_id: pvs1[0].id,
        form_data: JSON.stringify({}),
        point_value: 188,
        status: 'COMPLETE',
        sequence: 1,
        description: faker.commerce.productName(),
      },
      {
        id: faker.random.uuid(),
        form_schema: JSON.stringify({}),
        pv_id: pvs1[0].id,
        form_data: JSON.stringify({}),
        point_value: 44,
        status: 'INCOMPLETE',
        sequence: 1,
        description: faker.commerce.productName(),
      },
      {
        id: faker.random.uuid(),
        form_schema: JSON.stringify({}),
        pv_id: pvs2[0].id,
        form_data: JSON.stringify({}),
        point_value: 101,
        status: 'COMPLETE',
        sequence: 1,
        description: faker.commerce.productName(),
      },
      {
        id: faker.random.uuid(),
        form_schema: JSON.stringify({}),
        pv_id: pvs2[0].id,
        form_data: JSON.stringify({}),
        point_value: 188,
        status: 'COMPLETE',
        sequence: 1,
        description: faker.commerce.productName(),
      },
      {
        id: faker.random.uuid(),
        form_schema: JSON.stringify({}),
        pv_id: pvs2[0].id,
        form_data: JSON.stringify({}),
        point_value: 44,
        status: 'INCOMPLETE',
        sequence: 1,
        description: faker.commerce.productName(),
      },
    ];
    await db('users').insert(users);
    await db('organizations').insert(org1);
    await db('potential_voters').insert(pvs1);
    await db('potential_voters').insert(pvs2);
    await db('tasks').insert(tasks);
    const userPerms = {
      [org1.id]: ['AMBASSADOR'],
    };
    const query = `
      query {
          points{
            items {
              organization {
                id
              }
              user {
                first_name
                last_name
                email
              }
            }
          }
        }
    `;
    const rootValue = {};
    const context = new MakeContext({ user: { email: users[0].email, permissions: userPerms } });
    const result = await graphql(schema, query, rootValue, context);
    // console.log(JSON.stringify(result, null, '\t'));
    expect(result.data.points.items.length).toBe(2);
    expect(result.data.points.items).toContainEqual({
      organization: { id: org1.id },
      user: {
        first_name: users[0].first_name,
        last_name: users[0].last_name,
        email: users[0].email,
      },
    });
    expect(result.data.points.items).toContainEqual({
      organization: { id: org1.id },
      user: {
        first_name: users[1].first_name,
        last_name: users[1].last_name,
        email: null,
      },
    });
  });

  test('admin can see all email addys', async () => {
    const users = generateFakeUsers(2, 773);
    const org1 = { id: faker.random.uuid(), name: faker.company.companyName() };
    const pvs1 = generateFakePVs(1, 774, users[0].email, org1.id);
    const pvs2 = generateFakePVs(1, 775, users[1].email, org1.id);
    const tasks = [
      {
        id: faker.random.uuid(),
        form_schema: JSON.stringify({}),
        pv_id: pvs1[0].id,
        form_data: JSON.stringify({}),
        point_value: 101,
        status: 'COMPLETE',
        sequence: 1,
        description: faker.commerce.productName(),
      },
      {
        id: faker.random.uuid(),
        form_schema: JSON.stringify({}),
        pv_id: pvs1[0].id,
        form_data: JSON.stringify({}),
        point_value: 188,
        status: 'COMPLETE',
        sequence: 1,
        description: faker.commerce.productName(),
      },
      {
        id: faker.random.uuid(),
        form_schema: JSON.stringify({}),
        pv_id: pvs1[0].id,
        form_data: JSON.stringify({}),
        point_value: 44,
        status: 'INCOMPLETE',
        sequence: 1,
        description: faker.commerce.productName(),
      },
      {
        id: faker.random.uuid(),
        form_schema: JSON.stringify({}),
        pv_id: pvs2[0].id,
        form_data: JSON.stringify({}),
        point_value: 101,
        status: 'COMPLETE',
        sequence: 1,
        description: faker.commerce.productName(),
      },
      {
        id: faker.random.uuid(),
        form_schema: JSON.stringify({}),
        pv_id: pvs2[0].id,
        form_data: JSON.stringify({}),
        point_value: 188,
        status: 'COMPLETE',
        sequence: 1,
        description: faker.commerce.productName(),
      },
      {
        id: faker.random.uuid(),
        form_schema: JSON.stringify({}),
        pv_id: pvs2[0].id,
        form_data: JSON.stringify({}),
        point_value: 44,
        status: 'INCOMPLETE',
        sequence: 1,
        description: faker.commerce.productName(),
      },
    ];
    await db('users').insert(users);
    await db('organizations').insert(org1);
    await db('potential_voters').insert(pvs1);
    await db('potential_voters').insert(pvs2);
    await db('tasks').insert(tasks);
    const userPerms = {
      [org1.id]: ['AMBASSADOR', 'ADMIN'],
    };
    const query = `
      query {
          points{
            items {
              organization {
                id
              }
              user {
                first_name
                last_name
                email
              }
            }
          }
        }
    `;
    const rootValue = {};
    const context = new MakeContext({ user: { email: users[0].email, permissions: userPerms } });
    const result = await graphql(schema, query, rootValue, context);
    // console.log(JSON.stringify(result, null, '\t'));
    expect(result.data.points.items.length).toBe(2);
    expect(result.data.points.items).toContainEqual({
      organization: { id: org1.id },
      user: {
        first_name: users[0].first_name,
        last_name: users[0].last_name,
        email: users[0].email,
      },
    });
    expect(result.data.points.items).toContainEqual({
      organization: { id: org1.id },
      user: {
        first_name: users[1].first_name,
        last_name: users[1].last_name,
        email: users[1].email,
      },
    });
  });
});
