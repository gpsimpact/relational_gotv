class VoterModel {
  voterMultiSearch = async ({ where, page, order }, ctx) => {
    ctx.ensureIsAuthenticated();
    return await ctx.connectors.voters.voterMultiSearch(where, order, page);
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
