import { generateDeterministicCacheId, hasPermission } from '../utils';
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

    results.items = map(results.items, async result => {
      const userRecord = await ctx.connectors.user.userByEmail.load(result.user_email);
      // the user is not an admin, then do not return any email that is not their own.
      if (
        userRecord.email !== ctx.user.email &&
        !hasPermission(ctx.user, result.org_id, 'ADMIN', false)
      ) {
        userRecord.email = null;
      }

      return assign({}, result, {
        organization: ctx.connectors.organization.organizationById.load(result.org_id),
        user: userRecord,
      });
    });

    return results;
  };
}

export default PotentialVoterModel;
