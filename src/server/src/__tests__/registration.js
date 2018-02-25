import { graphql } from 'graphql';
import db from '../db';
import schema from '../graphql/schema';
import faker from 'faker';
import MakeContext from '../Context';
import { find } from 'lodash';

beforeAll(async () => await db.migrate.latest({ directory: 'src/db/migrations' }));
beforeEach(async () => await Promise.all([db.raw('TRUNCATE TABLE registrants CASCADE ')]));
afterAll(async () => await db.destroy());

describe('Registration Updates', () => {
  test('registrant call with No hash creates one', async () => {
    // faker.seed(199); // ensures consistent result
    const registrantRecord = {
      name_first: faker.name.firstName(),
      name_last: faker.name.lastName(),
    };
    const query = `
      mutation {
          updateRegistrant(
            data:{
              name_first: "${registrantRecord.name_first}", 
              name_last: "${registrantRecord.name_last}", 
            }
          ) {
            hash
            name_first
            name_last
          }
        }
    `;
    const rootValue = {};
    const context = new MakeContext({ user: null });
    const result = await graphql(schema, query, rootValue, context);
    var regexGuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    expect(regexGuid.test(result.data.updateRegistrant.hash)).toBe(true);
  });

  test('registrant update call with existing hash updates record', async () => {
    // create a registrant record
    const registrantRecord = {
      hash: faker.random.uuid(),
      name_first: faker.name.firstName(),
      name_last: faker.name.lastName(),
    };
    // insert registrant record directly into db
    await db.table('registrants').insert(registrantRecord);
    const new_name_first = 'Testy';
    const query = `
      mutation {
          updateRegistrant(
            data:{
              hash: "${registrantRecord.hash}",
              name_first: "${new_name_first}", 
            }
          ) {
            hash
            name_first
            name_last
          }
        }
    `;
    const rootValue = {};
    const context = new MakeContext({ user: null });
    const result = await graphql(schema, query, rootValue, context);
    // console.log(JSON.stringify(result, null, '\t'));
    expect(result.data.updateRegistrant.hash).toEqual(registrantRecord.hash);
    expect(result.data.updateRegistrant.name_last).toEqual(registrantRecord.name_last);
    expect(result.data.updateRegistrant.name_first).toEqual(new_name_first);
    const dbRecord = await db
      .table('registrants')
      .where({ hash: registrantRecord.hash })
      .first();
    expect(dbRecord.name_first).toEqual(new_name_first);
  });

  test('registrant update call with new provided hash inserts record', async () => {
    // create a registrant record
    const registrantRecord = {
      hash: faker.random.uuid(),
      name_first: faker.name.firstName(),
      name_last: faker.name.lastName(),
    };
    const query = `
      mutation {
          updateRegistrant(
            data:{
              hash: "${registrantRecord.hash}",
              name_first: "${registrantRecord.name_first}", 
              name_last: "${registrantRecord.name_last}", 
            }
          ) {
            hash
            name_first
            name_last
          }
        }
    `;
    const rootValue = {};
    const context = new MakeContext({ user: null });
    const result = await graphql(schema, query, rootValue, context);
    expect(result.data.updateRegistrant.hash).toEqual(registrantRecord.hash);
    expect(result.data.updateRegistrant.name_last).toEqual(registrantRecord.name_last);
    expect(result.data.updateRegistrant.name_first).toEqual(registrantRecord.name_first);
  });

  test('registrant update call updates updated timestamp', async () => {
    // create a registrant record
    const registrantRecord = {
      hash: faker.random.uuid(),
      name_first: faker.name.firstName(),
      name_last: faker.name.lastName(),
    };
    // insert registrant record directly into db
    const firstDbRecord = await db
      .table('registrants')
      .insert(registrantRecord)
      .returning('*');
    const new_name_first = 'Testy';
    const query = `
      mutation {
          updateRegistrant(
            data:{
              hash: "${registrantRecord.hash}",
              name_first: "${new_name_first}", 
            }
          ) {
            hash
            name_first
            name_last
          }
        }
    `;
    const rootValue = {};
    const context = new MakeContext({ user: null });
    await graphql(schema, query, rootValue, context);
    const updatedDbRecord = await db
      .table('registrants')
      .where({ hash: registrantRecord.hash })
      .first();
    expect(updatedDbRecord.updated_at).not.toEqual(firstDbRecord[0].updated_at);
  });

  test('registrant update call update is blocked if older than 48 hours', async () => {
    // make an old date
    const d = new Date();
    d.setDate(d.getDate() - 5);

    // create a registrant record
    const registrantRecord = {
      hash: faker.random.uuid(),
      name_first: faker.name.firstName(),
      name_last: faker.name.lastName(),
      updated_at: d,
    };
    // insert registrant record directly into db
    await db
      .table('registrants')
      .insert(registrantRecord)
      .returning('*');
    const new_name_first = 'Testy';
    const query = `
      mutation {
          updateRegistrant(
            data:{
              hash: "${registrantRecord.hash}",
              name_first: "${new_name_first}", 
            }
          ) {
            hash
            name_first
            name_last
          }
        }
    `;
    const rootValue = {};
    const context = new MakeContext({ user: null });
    const result = await graphql(schema, query, rootValue, context);
    // console.log(JSON.stringify(result, null, '\t'));
    expect(
      find(result.errors, { message: 'This record has been locked and can not be updated.' })
    ).not.toBeUndefined();
  });
});
