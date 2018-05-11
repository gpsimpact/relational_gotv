import { graphql } from 'graphql';
import db from '../db';
import schema from '../graphql/schema';
import faker from 'faker';
import MakeContext from '../Context';
import { find } from 'lodash';
// import bcrypt from 'bcrypt';
// import jwt from 'jsonwebtoken';
import { generateFakePVs, generateFakeUsers } from '../utils';
import { newPVtasks } from '../taskDefinitions';

beforeAll(async () => await db.migrate.latest({ directory: 'src/db/migrations' }));
beforeEach(
  async () =>
    await Promise.all([
      db.raw('TRUNCATE TABLE potential_voters CASCADE'),
      db.raw('TRUNCATE TABLE tasks CASCADE'),
      db.raw('TRUNCATE TABLE users CASCADE'),
      db.raw('TRUNCATE TABLE organizations CASCADE'),
    ])
);
afterAll(async () => await db.destroy());

describe('Tasks', () => {
  test('Can mutate task', async () => {
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
    const fake_form_data = { hello: 'world' };
    const query = `
      mutation updateTask($form_data: JSON) {
          updateTask(
            id: "${tasks[0].id}",
            status: COMPLETE,
            form_data: $form_data
          ) {
            id
            status
            form_data
            potential_voter{
              id
            }
          }
        }
    `;
    const rootValue = {};
    const context = new MakeContext({ user: { email: users[0].email, permissions: userPerms } });
    const result = await graphql(schema, query, rootValue, context, { form_data: fake_form_data });
    // console.log(JSON.stringify(result, null, '\t'));
    expect(result.data.updateTask.id).toBe(tasks[0].id);
    expect(result.data.updateTask.status).toBe('COMPLETE');
    expect(result.data.updateTask.form_data).toEqual(fake_form_data);
    expect(result.data.updateTask.potential_voter.id).toBe(pvs[0].id);
    // also check DB values
    const dbRecord = await db
      .table('tasks')
      .where({ id: tasks[0].id })
      .first();
    expect(dbRecord.id).toBe(tasks[0].id);
    expect(dbRecord.status).toBe('COMPLETE');
    expect(dbRecord.form_data).toEqual(fake_form_data);
  });

  test('Can NOT mutate task if the PV does not belong to the user', async () => {
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
        status: 'INCOMPLETE',
        sequence: 1,
        description: faker.commerce.productName(),
      },
    ];
    await db('users').insert(users[0]);
    await db('organizations').insert(org1);
    await db('potential_voters').insert(pvs);
    await db('tasks').insert(tasks);
    const fake_form_data = { hello: 'world' };
    const query = `
      mutation updateTask($form_data: JSON) {
          updateTask(
            id: "${tasks[0].id}",
            status: COMPLETE,
            form_data: $form_data
          ) {
            id
            status
            form_data
          }
        }
    `;
    const rootValue = {};
    const context = new MakeContext({ user: { email: 'bademail@test.org' } });
    const result = await graphql(schema, query, rootValue, context, { form_data: fake_form_data });
    expect(find(result.errors, { message: 'Insufficient permissions.' })).not.toBeUndefined();
  });

  test('creating new PV creates default tasks', async () => {
    // create a new pv
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
    const results = await graphql(schema, query, rootValue, context);
    // console.log(JSON.stringify(results, null, '\t'));
    // query db tasks for this pv
    const dbTasks = await db.table('tasks').where({ pv_id: results.data.createPotentialVoter.id });
    // expect db tasks for this pv to match
    expect(dbTasks.length).toEqual(newPVtasks.length);
  });

  test('task_availabillity view correctly checks dependency requirement when it is unmet', async () => {
    const users = generateFakeUsers(1, 1);
    const org1 = { id: faker.random.uuid(), name: faker.company.companyName() };
    const pvs = generateFakePVs(1, 11, users[0].email, org1.id);
    const tasks = [
      {
        id: 'alpha',
        form_schema: JSON.stringify({}),
        pv_id: pvs[0].id,
        form_data: JSON.stringify({}),
        point_value: faker.random.number(),
        status: 'INCOMPLETE',
        sequence: 1,
        description: faker.commerce.productName(),
      },
      {
        id: 'beta',
        form_schema: JSON.stringify({}),
        pv_id: pvs[0].id,
        form_data: JSON.stringify({}),
        point_value: faker.random.number(),
        status: 'INCOMPLETE',
        sequence: 1,
        description: faker.commerce.productName(),
        only_after_completion_of: 'alpha',
      },
    ];
    await db('users').insert(users[0]);
    await db('organizations').insert(org1);
    await db('potential_voters').insert(pvs);
    await db('tasks').insert(tasks);
    const dbTasks = await db
      .table('task_availability')
      .where({ pv_id: pvs[0].id, id: 'beta' })
      .first();
    expect(dbTasks.dependency_met).toBe(false);
  });

  test('task_availabillity view correctly checks dependency requirement when it is met', async () => {
    const users = generateFakeUsers(1, 1);
    const org1 = { id: faker.random.uuid(), name: faker.company.companyName() };
    const pvs = generateFakePVs(1, 11, users[0].email, org1.id);
    const tasks = [
      {
        id: 'alpha',
        form_schema: JSON.stringify({}),
        pv_id: pvs[0].id,
        form_data: JSON.stringify({}),
        point_value: faker.random.number(),
        status: 'INCOMPLETE',
        sequence: 1,
        description: faker.commerce.productName(),
      },
      {
        id: 'beta',
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
    const dbTasks = await db
      .table('task_availability')
      .where({ pv_id: pvs[0].id, id: 'beta' })
      .first();
    expect(dbTasks.dependency_met).toBe(true);
  });

  test('task_availabillity view correctly states time relevancy', async () => {
    const users = generateFakeUsers(1, 1);
    const org1 = { id: faker.random.uuid(), name: faker.company.companyName() };
    const pvs = generateFakePVs(1, 11, users[0].email, org1.id);
    const tasks = [
      {
        id: 'alpha',
        form_schema: JSON.stringify({}),
        pv_id: pvs[0].id,
        form_data: JSON.stringify({}),
        point_value: faker.random.number(),
        status: 'INCOMPLETE',
        sequence: 1,
        description: faker.commerce.productName(),
        not_visible_before: '2020-01-01',
      },
      {
        id: 'beta',
        form_schema: JSON.stringify({}),
        pv_id: pvs[0].id,
        form_data: JSON.stringify({}),
        point_value: faker.random.number(),
        status: 'INCOMPLETE',
        sequence: 1,
        description: faker.commerce.productName(),
        not_visible_after: '2010-01-01',
      },
      {
        id: 'charlie',
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
    const alpha = await db
      .table('task_availability')
      .where({ pv_id: pvs[0].id, id: 'alpha' })
      .first();
    expect(alpha.time_constraint_available).toBe(false);

    const beta = await db
      .table('task_availability')
      .where({ pv_id: pvs[0].id, id: 'beta' })
      .first();
    expect(beta.time_constraint_available).toBe(false);

    const charlie = await db
      .table('task_availability')
      .where({ pv_id: pvs[0].id, id: 'charlie' })
      .first();
    expect(charlie.time_constraint_available).toBe(true);
  });

  test('task_availabillity view correctly states status availabillity', async () => {
    const users = generateFakeUsers(1, 1);
    const org1 = { id: faker.random.uuid(), name: faker.company.companyName() };
    const pvs = generateFakePVs(1, 11, users[0].email, org1.id);
    const tasks = [
      {
        id: 'alpha',
        form_schema: JSON.stringify({}),
        pv_id: pvs[0].id,
        form_data: JSON.stringify({}),
        point_value: faker.random.number(),
        status: 'INCOMPLETE',
        sequence: 1,
        description: faker.commerce.productName(),
      },
      {
        id: 'beta',
        form_schema: JSON.stringify({}),
        pv_id: pvs[0].id,
        form_data: JSON.stringify({}),
        point_value: faker.random.number(),
        status: 'COMPLETE',
        sequence: 1,
        description: faker.commerce.productName(),
      },
      {
        id: 'charlie',
        form_schema: JSON.stringify({}),
        pv_id: pvs[0].id,
        form_data: JSON.stringify({}),
        point_value: faker.random.number(),
        status: 'INPROGRESS',
        sequence: 1,
        description: faker.commerce.productName(),
      },
    ];
    await db('users').insert(users[0]);
    await db('organizations').insert(org1);
    await db('potential_voters').insert(pvs);
    await db('tasks').insert(tasks);

    const alpha = await db
      .table('task_availability')
      .where({ pv_id: pvs[0].id, id: 'alpha' })
      .first();
    expect(alpha.status_available).toBe(true);

    const beta = await db
      .table('task_availability')
      .where({ pv_id: pvs[0].id, id: 'beta' })
      .first();
    expect(beta.status_available).toBe(false);

    const charlie = await db
      .table('task_availability')
      .where({ pv_id: pvs[0].id, id: 'charlie' })
      .first();
    expect(charlie.status_available).toBe(true);
  });
});
