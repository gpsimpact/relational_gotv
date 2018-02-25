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

export const hasPermission = (viewer, service, requiredPermission, throwOnFail = false) => {
  if (!includes(viewer.permissions[service], requiredPermission)) {
    if (throwOnFail) {
      throw new InsufficientPermissionsError();
    }
    return false;
  }
  return true;
};
