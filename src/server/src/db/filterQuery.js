import { map } from 'lodash';

// heavy inspiration from https://gist.github.com/gc-codesnippets/f302c104f2806f9e13f41d909e07d82d
// 14 basic ops are
// _is
// _not
// _in
// _not_in
// _lt
// _lte
// _gt
// _gte
// _contains
// _not_contains
// _starts_with
// _not_starts_with
// _ends_with
// _not_ends_with
// AND
// OR

export const filterQuery = (query, where, or) => {
  if (!where) {
    return query;
  }

  map(where, (value, key) => {
    // _is
    if (key.endsWith('_is')) {
      const field = key.replace('_is', '');
      if (!or) {
        query.where(field, value);
      } else {
        query.orWhere(field, value);
      }
    }

    // _not
    if (key.endsWith('_not')) {
      const field = key.replace('_not', '');
      if (!or) {
        query.where(field, '!=', value);
      } else {
        query.orWhere(field, '!=', value);
      }
    }

    // _in: [String!]
    if (key.endsWith('_in')) {
      const field = key.replace('_in', '');
      if (!or) {
        query.whereIn(field, value);
      } else {
        query.orWhereIn(field, value);
      }
    }

    // _not_in: [String!]
    if (key.endsWith('_not_in')) {
      const field = key.replace('_not_in', '');
      if (!or) {
        query.whereNotIn(field, value);
      } else {
        query.orWhereNotIn(field, value);
      }
    }

    // _lt
    if (key.endsWith('_lt')) {
      const field = key.replace('_lt', '');
      if (!or) {
        query.where(field, '<', value);
      } else {
        query.orWhere(field, '<', value);
      }
    }

    // _lte
    if (key.endsWith('_lte')) {
      const field = key.replace('_lte', '');
      if (!or) {
        query.where(field, '<=', value);
      } else {
        query.orWhere(field, '<=', value);
      }
    }

    // _gt
    if (key.endsWith('_gt')) {
      const field = key.replace('_gt', '');
      if (!or) {
        query.where(field, '>', value);
      } else {
        query.orWhere(field, '>', value);
      }
    }

    // _gte
    if (key.endsWith('_gte')) {
      const field = key.replace('_gte', '');
      if (!or) {
        query.where(field, '>=', value);
      } else {
        query.orWhere(field, '>=', value);
      }
    }

    // _contains
    if (key.endsWith('_contains')) {
      const field = key.replace('_contains', '');
      if (!or) {
        query.where(field, 'ILIKE', `%${value}%`);
      } else {
        query.orWhere(field, 'ILIKE', `%${value}%`);
      }
    }

    // _not_contains
    if (key.endsWith('_not_contains')) {
      const field = key.replace('_not_contains', '');
      if (!or) {
        query.where(field, 'NOT ILIKE', `%${value}%`);
      } else {
        query.orWhere(field, 'NOT ILIKE', `%${value}%`);
      }
    }

    // _starts_with
    if (key.endsWith('_starts_with')) {
      const field = key.replace('_starts_with', '');
      if (!or) {
        query.where(field, 'ILIKE', `${value}%`);
      } else {
        query.orWhere(field, 'ILIKE', `${value}%`);
      }
    }

    // _not_starts_with
    if (key.endsWith('_not_starts_with')) {
      const field = key.replace('_not_starts_with', '');
      if (!or) {
        query.where(field, 'NOT ILIKE', `${value}%`);
      } else {
        query.orWhere(field, 'NOT ILIKE', `${value}%`);
      }
    }

    // _ends_with
    if (key.endsWith('_ends_with')) {
      const field = key.replace('_ends_with', '');
      if (!or) {
        query.where(field, 'ILIKE', `%${value}`);
      } else {
        query.orWhere(field, 'ILIKE', `%${value}`);
      }
    }

    // _not_ends_with
    if (key.endsWith('_not_ends_with')) {
      const field = key.replace('_not_ends_with', '');
      if (!or) {
        query.where(field, 'NOT ILIKE', `%${value}`);
      } else {
        query.orWhere(field, 'NOT ILIKE', `%${value}`);
      }
    }

    // and
    if (key === 'AND') {
      map(value, op => {
        query.andWhere(function() {
          filterQuery(this, op, false);
        });
      });
    }

    // or
    if (key === 'OR') {
      map(value, op => {
        query.orWhere(function() {
          filterQuery(this, op, true);
        });
      });
    }
  });
  return query;
};
