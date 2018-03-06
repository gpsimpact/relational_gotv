import { hasPermission } from '../utils';
import { InsufficientPermissionsError, InsufficientIdFieldsError } from '../errors';
import { omit } from 'lodash';

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
    if (data.id) {
      // get existing record
      const existingRecord = await ctx.connectors.potentialVoters.pvByUserById.load(data.id);
      // don't allow update if this is not their PV
      if (existingRecord.user_email !== ctx.user.email) {
        throw new InsufficientPermissionsError();
      }
      if (hasPermission(ctx.user, existingRecord.org_id, 'AMBASSADOR', true)) {
        // remove email, id, and org_id from eligible update values
        const writeSafeValues = omit(data, ['id', 'user_email', 'org_id']);
        const manualUpdate = await ctx.connectors.potentialVoters.updatePotentialVoterById(
          data.id,
          writeSafeValues
        );
        return await ctx.connectors.potentialVoters.pvByUserById
          .clear(data.id)
          .prime(data.id, manualUpdate[0])
          .load(data.id);
      }
    }
    if (!ctx.user.email || !data.org_id) {
      throw new InsufficientIdFieldsError({
        message:
          'You must provide either an id to update or user_email + org_id to create new potential voter.',
      });
    }

    if (hasPermission(ctx.user, data.org_id, 'AMBASSADOR', true)) {
      const dlKey = {
        user_email: ctx.user.email,
        org_id: data.org_id,
      };

      const manualInsert = await ctx.connectors.potentialVoters.createPotentialVoter({
        ...data,
        user_email: ctx.user.email,
      });

      return await ctx.connectors.potentialVoters.pvByUserByOrg
        .clear(dlKey)
        .prime(dlKey, manualInsert[0])
        .load(dlKey);
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
