import { hasPermission } from '../utils';
import { InsufficientPermissionsError } from '../errors';
// import { omit } from 'lodash';
import { newPVtasks } from '../taskDefinitions';

class PotentialVoterModel {
  userPVsWithinOrg = async ({ org_id }, ctx) => {
    if (hasPermission(ctx.user, org_id, 'AMBASSADOR', true)) {
      return await ctx.connectors.potentialVoters.pvByUserByOrg.load({
        user_email: ctx.user.email,
        org_id,
      });
    }
  };

  createPotentialVoter = async ({ data }, ctx) => {
    if (hasPermission(ctx.user, data.org_id, 'AMBASSADOR', true)) {
      const dlKey = {
        user_email: ctx.user.email,
        org_id: data.org_id,
      };

      const manualInsert = await ctx.connectors.potentialVoters.createPotentialVoter({
        ...data,
        user_email: ctx.user.email,
      });

      await ctx.connectors.tasks.bulkAddTasks(manualInsert[0].id, newPVtasks);

      return await ctx.connectors.potentialVoters.pvByUserByOrg
        .clear(dlKey)
        .prime(dlKey, manualInsert[0])
        .load(dlKey);
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

  getPvInfo = async ({ id }, ctx) => {
    // get existing record
    const existingRecord = await ctx.connectors.potentialVoters.pvByUserById.load(id);
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
