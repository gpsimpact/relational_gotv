import { hasPermission, generateDeterministicCacheId } from '../utils';
import { InsufficientPermissionsError } from '../errors';
import { filter, includes, keys } from 'lodash';
import { newPVtasks } from '../taskDefinitions';

class PotentialVoterModel {
  pvMultiSearch = async ({ where, orderBy, limit, after }, ctx) => {
    const fetchPayload = {
      table: {
        name: 'potential_voters',
        uniqueColumn: 'id',
      },
      where: Object.assign({}, where, { user_email_is: ctx.user.email }),
      orderBy,
      limit,
      after,
    };

    const results = await ctx.connectors.page.pageLoader.load(
      generateDeterministicCacheId(fetchPayload)
    );

    // filter out any results that dont below to this user
    // AND belong to org they do not have access to
    results.items = filter(results.items, item => {
      return (
        item.user_email === ctx.user.email &&
        includes(keys(ctx.user.permissions), item.org_id) &&
        includes(ctx.user.permissions[item.org_id], 'AMBASSADOR')
      );
    });

    return results;
  };

  createPotentialVoter = async ({ data }, ctx) => {
    if (hasPermission(ctx.user, data.org_id, 'AMBASSADOR', true)) {
      // const dlKey = {
      //   user_email: ctx.user.email,
      //   org_id: data.org_id,
      // };

      const manualInsert = await ctx.connectors.potentialVoters.createPotentialVoter({
        ...data,
        user_email: ctx.user.email,
      });

      await ctx.connectors.tasks.bulkAddTasks(manualInsert[0].id, newPVtasks);

      // return await ctx.connectors.potentialVoters.pvByUserByOrg
      //   .clear(dlKey)
      //   .prime(dlKey, manualInsert[0])
      //   .load(dlKey);

      return ctx.connectors.potentialVoters.pvByUserById
        .clear(manualInsert[0].id)
        .prime(manualInsert[0].id, manualInsert[0])
        .load(manualInsert[0].id);
    }
  };

  updatePotentialVoter = async ({ id, data }, ctx) => {
    // get existing record
    const existingRecord = await ctx.connectors.potentialVoters.pvByUserById.load(id);
    // don't allow update if this is not their PV
    if (existingRecord.user_email !== ctx.user.email) {
      throw new InsufficientPermissionsError();
    }
    if (hasPermission(ctx.user, existingRecord.org_id, 'AMBASSADOR', true)) {
      const manualUpdate = await ctx.connectors.potentialVoters.updatePotentialVoterById(id, data);
      return await ctx.connectors.potentialVoters.pvByUserById
        .clear(id)
        .prime(id, manualUpdate[0])
        .load(id);
    }
  };

  singlePv = async ({ where }, ctx) => {
    // get existing record
    const existingRecord = await ctx.connectors.potentialVoters.pvByUserById.load(where.id);
    // don't allow update if this is not their PV
    if (existingRecord.user_email !== ctx.user.email) {
      throw new InsufficientPermissionsError();
    }
    if (hasPermission(ctx.user, existingRecord.org_id, 'AMBASSADOR', true)) {
      return existingRecord;
    }
  };
}

export default PotentialVoterModel;
