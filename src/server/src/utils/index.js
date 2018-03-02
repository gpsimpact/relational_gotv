import faker from 'faker';
import { includes } from 'lodash';
import { InsufficientPermissionsError } from '../errors';

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
    .map((_, i) => {
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
  const vote_methods = ['early-in-person', 'mail', 'election-day', 'N/A'];
  Array(num)
    .fill()
    .map((_, i) => {
      fakePVs.push({
        id: faker.random.uuid(),
        first_name: faker.name.firstName(),
        last_name: faker.name.lastName(),
        city: faker.address.city(),
        user_email,
        org_id,
        state_file_id: faker.random.number(),
        vo_ab_requested: faker.random.boolean(),
        vo_ab_requested_iso8601: faker.date.recent(),
        vo_voted: faker.random.boolean(),
        vo_voted_iso8601: faker.date.recent(),
        vo_voted_method: vote_methods[Math.floor(Math.random() * vote_methods.length)],
      });
    });
  return fakePVs;
};

export const hasPermission = (viewer, service, requiredPermission, throwOnFail = false) => {
  if (!includes(viewer.permissions[service], requiredPermission)) {
    if (throwOnFail) {
      throw new InsufficientPermissionsError();
    }
    return false;
  }
  return true;
};
