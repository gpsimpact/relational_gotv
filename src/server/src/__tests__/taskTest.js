import { graphql } from 'graphql';
import db from '../db';
import schema from '../graphql/schema';
import faker from 'faker';
import MakeContext from '../Context';
import { find } from 'lodash';
// import bcrypt from 'bcrypt';
// import jwt from 'jsonwebtoken';
import { generateFakePVs, generateFakeUsers, generateFakeVoters } from '../utils';

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
});
