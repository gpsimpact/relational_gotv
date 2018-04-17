import { graphql } from 'graphql';
import db from '../db';
import schema from '../graphql/schema';
import faker from 'faker';
import MakeContext from '../Context';
// import { find } from 'lodash';
// import bcrypt from 'bcrypt';
// import jwt from 'jsonwebtoken';
import { generateFakePVs, generateFakeUsers } from '../utils';
import redisDb from '../redisClient';

beforeAll(async () => await db.migrate.latest({ directory: 'src/db/migrations' }));
beforeEach(
  async () =>
    await Promise.all([
      db.raw('TRUNCATE TABLE potential_voters CASCADE'),
      db.raw('TRUNCATE TABLE tasks CASCADE'),
      db.raw('TRUNCATE TABLE users CASCADE'),
      db.raw('TRUNCATE TABLE organizations CASCADE'),
      redisDb.flushallAsync(),
    ])
);
afterAll(async () => await db.destroy());

describe('Tasks', () => {
  test('user can get total points', async () => {
    const users = generateFakeUsers(1, 1);
    const org1 = { id: faker.random.uuid(), name: faker.company.companyName() };
    const pvs = generateFakePVs(1, 11, users[0].email, org1.id);
    const tasks = [
      {
        id: faker.random.uuid(),
        form_schema: JSON.stringify({}),
        pv_id: pvs[0].id,
        form_data: JSON.stringify({}),
        point_value: 101,
        status: 'COMPLETE',
        sequence: 1,
        description: faker.commerce.productName(),
      },
      {
        id: faker.random.uuid(),
        form_schema: JSON.stringify({}),
        pv_id: pvs[0].id,
        form_data: JSON.stringify({}),
        point_value: 188,
        status: 'COMPLETE',
        sequence: 1,
        description: faker.commerce.productName(),
      },
      {
        id: faker.random.uuid(),
        form_schema: JSON.stringify({}),
        pv_id: pvs[0].id,
        form_data: JSON.stringify({}),
        point_value: 44,
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
    // console.log(JSON.stringify(result, null, '\t'));
    expect(result.data.points.items.length).toBe(1);
    expect(result.data.points.items).toContainEqual({
      organization: { id: org1.id },
      user: {
        first_name: users[0].first_name,
        last_name: users[0].last_name,
        email: users[0].email,
      },
      earned: 289,
      potential: 44,
    });
  });

  test('non admin can only see their own email addy', async () => {
    const users = generateFakeUsers(2, 1);
    const org1 = { id: faker.random.uuid(), name: faker.company.companyName() };
    const pvs1 = generateFakePVs(1, 11, users[0].email, org1.id);
    const pvs2 = generateFakePVs(1, 155, users[1].email, org1.id);
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
              earned
              potential
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
      earned: 289,
      potential: 44,
    });
    expect(result.data.points.items).toContainEqual({
      organization: { id: org1.id },
      user: {
        first_name: users[1].first_name,
        last_name: users[1].last_name,
        email: null,
      },
      earned: 289,
      potential: 44,
    });
  });

  test('admin can see all email addys', async () => {
    const users = generateFakeUsers(2, 1);
    const org1 = { id: faker.random.uuid(), name: faker.company.companyName() };
    const pvs1 = generateFakePVs(1, 11, users[0].email, org1.id);
    const pvs2 = generateFakePVs(1, 155, users[1].email, org1.id);
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
              earned
              potential
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
      earned: 289,
      potential: 44,
    });
    expect(result.data.points.items).toContainEqual({
      organization: { id: org1.id },
      user: {
        first_name: users[1].first_name,
        last_name: users[1].last_name,
        email: users[1].email,
      },
      earned: 289,
      potential: 44,
    });
  });
});
