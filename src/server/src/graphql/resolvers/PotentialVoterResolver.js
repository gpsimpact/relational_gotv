export default {
  PotentialVoter: {
    nextTask: async (root, args, ctx) => {
      return await ctx.connectors.tasks.nextTaskByPvId.load(root.id);
    },
    countCompletedTasks: async (root, args, ctx) => {
      const data = await ctx.connectors.tasks.completedTasksCountByPvId.load(root.id);
      return data && data.countCompletedTasks ? data.countCompletedTasks : 0;
    },
    countAvailableTasks: async (root, args, ctx) => {
      const data = await ctx.connectors.tasks.availableTasksCountByPvId.load(root.id);
      return data && data.countAvailableTasks ? data.countAvailableTasks : 0;
    },
    voPoints: async (root, args, ctx) => {
      // this may be long enough to break into its own model method.
      if (root.state_file_id) {
        const data = await ctx.connectors.voters.voterPointsById.load(root.state_file_id);
        return data && data.total_vo_points ? data.total_vo_points : 0;
      }
      return 0;
    },
    taskPoints: async (root, args, ctx) => {
      const data = await ctx.connectors.tasks.taskPointsById.load(root.id);
      return data && data.total_task_points ? data.total_task_points : 0;
    },
  },
  Query: {
    potentialVoters(root, args, ctx) {
      return ctx.models.potentialVoters.pvMultiSearch(args, ctx);
    },
    potentialVoter(root, args, ctx) {
      return ctx.models.potentialVoters.singlePv(args, ctx);
    },
  },
  Mutation: {
    createPotentialVoter(root, args, ctx) {
      return ctx.models.potentialVoters.createPotentialVoter(args, ctx);
    },
    updatePotentialVoter(root, args, ctx) {
      return ctx.models.potentialVoters.updatePotentialVoter(args, ctx);
    },
  },
};
