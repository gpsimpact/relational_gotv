export default {
  Query: {
    myPotentialVoters(root, args, ctx) {
      return ctx.models.potentialVoters.userPVsWithinOrg(args, ctx);
    },
    potentialVoterInfo(root, args, ctx) {
      return ctx.models.potentialVoters.getPvInfo(args, ctx);
    },
  },
  Mutation: {
    createPotentialVoter(root, args, ctx) {
      return ctx.models.potentialVoters.createPotentialVoter(args, ctx);
    },
  },
};
