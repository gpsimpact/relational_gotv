import { hasPermission } from '../utils';
import { InsufficientPermissionsError, InsufficientIdFieldsError } from '../errors';
import { omit } from 'lodash';

class VoterModel {
  voterMultiSearch = async ({ where, whereLike }, ctx) => {
    ctx.ensureIsAuthenticated();
    return await ctx.connectors.voters.voterMultiSearch(where, whereLike);
  };
}

export default VoterModel;
