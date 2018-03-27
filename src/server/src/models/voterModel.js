class VoterModel {
  voterMultiSearch = async ({ where, orderBy, limit, after }, ctx) => {
    ctx.ensureIsAuthenticated();
    return await ctx.connectors.voters.voterMultiSearch(where, orderBy, limit, after);
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
