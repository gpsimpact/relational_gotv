import { graphql } from 'graphql';
import db from '../db';
import schema from '../graphql/schema';
import faker from 'faker';
import MakeContext from '../Context';
import redisDb from '../redisClient';
// import { find } from 'lodash';
// import bcrypt from 'bcrypt';
// import jwt from 'jsonwebtoken';
// import { generateFakeUsers } from '../utils';

beforeAll(async () => await db.migrate.latest({ directory: 'src/db/migrations' }));
beforeEach(
  async () =>
    await Promise.all([db.raw('TRUNCATE TABLE organizations CASCADE'), redisDb.flushallAsync()])
);
afterAll(async () => await db.destroy());

describe('Organizational Info', () => {
  test('Get org info via slug', async () => {
    const org1 = {
      id: faker.random.uuid(),
      name: faker.company.companyName(),
      cta: faker.company.catchPhrase(),
      slug: faker.lorem.slug(),
      contact_name: `${faker.name.firstName()} ${faker.name.lastName()}`,
      contact_email: faker.internet.email(),
      contact_phone: faker.phone.phoneNumber(),
    };

    await db('organizations').insert(org1);

    const rootValue = {};
    const context = new MakeContext({
      user: null,
    });

    const query = `
      query {
          organization(
            where: {
              slug: "${org1.slug}"
            },
          ) {
            id
            name
            cta
            slug
            contact_name
            contact_email
            contact_phone
          }
        }
    `;
    const result = await graphql(schema, query, rootValue, context);
    // console.log(JSON.stringify(result, null, '\t'));
    expect(result.data.organization).toEqual(org1);
  });

  test('Get org info via id', async () => {
    const org1 = {
      id: faker.random.uuid(),
      name: faker.company.companyName(),
      cta: faker.company.catchPhrase(),
      slug: faker.lorem.slug(),
      contact_name: `${faker.name.firstName()} ${faker.name.lastName()}`,
      contact_email: faker.internet.email(),
      contact_phone: faker.phone.phoneNumber(),
    };

    await db('organizations').insert(org1);

    const rootValue = {};
    const context = new MakeContext({
      user: null,
    });

    const query = `
      query {
          organization(
            where: {
              id: "${org1.id}"
            },
          ) {
            id
            name
            cta
            slug
            contact_name
            contact_email
            contact_phone
          }
        }
    `;
    const result = await graphql(schema, query, rootValue, context);
    // console.log(JSON.stringify(result, null, '\t'));
    expect(result.data.organization).toEqual(org1);
  });

  test('Can search for orgs', async () => {
    const orgs = [
      {
        id: faker.random.uuid(),
        name: faker.company.companyName(),
        cta: faker.company.catchPhrase(),
        slug: faker.lorem.slug(),
        contact_name: `${faker.name.firstName()} ${faker.name.lastName()}`,
        contact_email: faker.internet.email(),
        contact_phone: faker.phone.phoneNumber(),
      },
      {
        id: faker.random.uuid(),
        name: faker.company.companyName(),
        cta: faker.company.catchPhrase(),
        slug: faker.lorem.slug(),
        contact_name: `${faker.name.firstName()} ${faker.name.lastName()}`,
        contact_email: faker.internet.email(),
        contact_phone: faker.phone.phoneNumber(),
      },
      {
        id: faker.random.uuid(),
        name: faker.company.companyName(),
        cta: faker.company.catchPhrase(),
        slug: faker.lorem.slug(),
        contact_name: `${faker.name.firstName()} ${faker.name.lastName()}`,
        contact_email: faker.internet.email(),
        contact_phone: faker.phone.phoneNumber(),
      },
    ];
    await db('organizations').insert(orgs);
    const rootValue = {};
    const context = new MakeContext({
      user: null,
    });

    const query = `
      query {
          organizations {
            items {
              id
              name
              cta
              slug
              contact_name
              contact_email
              contact_phone
            }
          }
        }
    `;
    const result = await graphql(schema, query, rootValue, context);
    // console.log(JSON.stringify(result, null, '\t'));
    expect(result.data.organizations.items).toEqual(expect.arrayContaining(orgs));
  });
});
