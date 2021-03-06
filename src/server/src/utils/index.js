import faker from 'faker';
import { includes, has } from 'lodash';
import { InsufficientPermissionsError } from '../errors';
import stringify from 'json-stable-stringify';
import base64 from 'base-64';

export function mapTo(keys, keyFn) {
  return rows => {
    const group = new Map(keys.map(key => [key, null]));
    rows.forEach(row => group.set(keyFn(row), row));
    return Array.from(group.values());
  };
}

export function mapToMany(keys, keyFn) {
  return rows => {
    const group = new Map(keys.map(key => [key, []]));
    rows.forEach(row => (group.get(keyFn(row)) || []).push(row));
    return Array.from(group.values());
  };
}

export function mapToValues(keys, keyFn, valueFn) {
  return rows => {
    const group = new Map(keys.map(key => [key, null]));
    rows.forEach(row => group.set(keyFn(row), valueFn(row)));
    return Array.from(group.values());
  };
}

export const generateFakeUsers = (num, seed) => {
  faker.seed(seed); // ensures consistent result
  const fakeUsers = [];
  Array(num)
    .fill()
    .map(() => {
      fakeUsers.push({
        first_name: faker.name.firstName(),
        last_name: faker.name.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      });
    });
  return fakeUsers;
};

export const generateFakePVs = (num, seed, user_email, org_id) => {
  faker.seed(seed); // ensures consistent result
  const fakePVs = [];
  // const vote_methods = ['early-in-person', 'mail', 'election-day', 'N/A'];
  Array(num)
    .fill()
    .map(() => {
      fakePVs.push({
        id: faker.random.uuid(),
        first_name: faker.name.firstName(),
        last_name: faker.name.lastName(),
        city: faker.address.city(),
        deleted: false,
        user_email,
        org_id,
      });
    });
  return fakePVs;
};

export const generateFakeTasks = (num, seed, pv_id) => {
  faker.seed(seed); // ensures consistent result
  const fakeTasks = [];
  const status = ['COMPLETE', 'INCOMPLETE', 'INPROGRESS', 'SKIPPED'];
  Array(num)
    .fill()
    .map(() => {
      fakeTasks.push({
        id: faker.random.uuid(),
        form_schema: JSON.stringify({}),
        pv_id,
        form_data: JSON.stringify({}),
        point_value: faker.random.number(),
        status: status[Math.floor(Math.random() * status.length)],
        sequence: faker.random.number(),
        description: faker.commerce.productName(),
      });
    });
  return fakeTasks;
};

export const generateFakeVoters = (num, seed) => {
  faker.seed(seed); // ensures consistent result
  const fakeVoters = [];
  const vote_methods = ['early-in-person', 'mail', 'election-day', 'N/A'];
  Array(num)
    .fill()
    .map(() => {
      fakeVoters.push({
        state_file_id: faker.random.number().toString(),
        first_name: faker.name.firstName(),
        middle_name: faker.name.firstName(),
        last_name: faker.name.lastName(),
        home_address: faker.address.streetAddress(),
        city: faker.address.city(),
        state: faker.address.state(),
        zipcode: faker.address.zipCode(),
        dob: faker.date
          .between('1917-01-01', '1999-02-01')
          .toISOString()
          .substring(0, 10),
        vo_ab_requested_primary: faker.random.boolean(),
        vo_ab_requested_date_primary: faker.date
          .recent()
          .toISOString()
          .substring(0, 10),
        vo_voted_primary: faker.random.boolean(),
        vo_voted_date_primary: faker.date
          .recent()
          .toISOString()
          .substring(0, 10),
        vo_voted_method_primary: vote_methods[Math.floor(Math.random() * vote_methods.length)],
        vo_ab_requested_general: faker.random.boolean(),
        vo_ab_requested_date_general: faker.date
          .recent()
          .toISOString()
          .substring(0, 10),
        vo_voted_general: faker.random.boolean(),
        vo_voted_date_general: faker.date
          .recent()
          .toISOString()
          .substring(0, 10),
        vo_voted_method_general: vote_methods[Math.floor(Math.random() * vote_methods.length)],
      });
    });
  return fakeVoters;
};

export const hasPermission = (viewer, service, requiredPermission, throwOnFail = false) => {
  if (!has(viewer, 'permissions')) {
    return false;
  }
  if (!includes(viewer.permissions[service], requiredPermission)) {
    if (throwOnFail) {
      throw new InsufficientPermissionsError();
    }
    return false;
  }
  return true;
};

export const generateDeterministicCacheId = args => base64.encode(stringify(args));
export const decodeDeterministicCacheId = cacheId => JSON.parse(base64.decode(cacheId));
