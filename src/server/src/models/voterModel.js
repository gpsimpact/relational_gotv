import { hasPermission } from '../utils';
import { InsufficientPermissionsError, InsufficientIdFieldsError } from '../errors';
import { omit } from 'lodash';

class VoterModel {
  voterMultiSearch = async ({ where, whereLike }, ctx) => {
    ctx.ensureIsAuthenticated();
    return await ctx.connectors.voters.voterMultiSearch(where, whereLike);
  };

  voterSingleSearch = async ({ where }, ctx) => {
    ctx.ensureIsAuthenticated();
    if (where.state_file_id) {
      return await ctx.connectors.voters.voterById.load(where.state_file_id);
    }
    return await ctx.connectors.voters.voterSingleSearch(where);
  };
}

export default VoterModel;
