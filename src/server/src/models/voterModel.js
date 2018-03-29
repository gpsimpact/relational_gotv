import { generateDeterministicCacheId } from '../utils';

class VoterModel {
  voterMultiSearch = async ({ where, orderBy, limit, after }, ctx) => {
    ctx.ensureIsAuthenticated();
    const fetchPayload = {
      table: {
        name: 'voter_file',
        uniqueColumn: 'state_file_id',
      },
      where,
      orderBy,
      limit,
      after,
      ttl: 120,
    };
    // return await ctx.connectors.voters.voterMultiSearch(where, orderBy, limit, after);
    return await ctx.connectors.page.pageLoader.load(generateDeterministicCacheId(fetchPayload));
  };

  voterSingleSearch = async ({ where, page }, ctx) => {
    ctx.ensureIsAuthenticated();
    if (where.state_file_id) {
      return await ctx.connectors.voters.voterById.load(where.state_file_id);
    }
    return await ctx.connectors.voters.voterSingleSearch(where, page);
  };
}

export default VoterModel;
