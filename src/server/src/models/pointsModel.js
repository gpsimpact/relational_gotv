import { generateDeterministicCacheId } from '../utils';
// import { InsufficientPermissionsError } from '../errors';
import { map, assign } from 'lodash';
// import { newPVtasks } from '../taskDefinitions';

class PotentialVoterModel {
  pointsMultiSearch = async ({ where, orderBy, limit, after }, ctx) => {
    ctx.ensureIsAuthenticated();
    const fetchPayload = {
      table: {
        name: 'points_rollup',
        uniqueColumn: 'id',
      },
      where,
      orderBy,
      limit,
      after,
    };

    let results = await ctx.connectors.page.pageLoader.load(
      generateDeterministicCacheId(fetchPayload)
    );

    // console.log(results);

    results.items = map(results.items, result => {
      return assign({}, result, {
        organization: ctx.connectors.organization.organizationById.load(result.org_id),
        user: ctx.connectors.user.userByEmail.load(result.user_email),
      });
    });

    // NEED TO GIVE SOME THOUGHT TO SECURITY HERE.. Probably should not expose user email to non-admin. opening issue

    return results;
  };
}

export default PotentialVoterModel;
