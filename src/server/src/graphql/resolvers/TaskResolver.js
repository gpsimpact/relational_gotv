export default {
  Task: {
    potential_voter: async (root, args, ctx) => {
      if (!root.potential_voter) return {};
      return ctx.connectors.potentialVoters.pvByUserById.load(root.potential_voter);
    },
  },
  Mutation: {
    updateTask(root, args, ctx) {
      return ctx.models.tasks.updateTask(args, ctx);
    },
  },
};
