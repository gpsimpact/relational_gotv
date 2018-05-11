export default {
  PotentialVoter: {
    nextTask: async (root, args, ctx) => {
      return await ctx.connectors.tasks.nextTaskByPvId.load(root.id);
    },
    tasks: async (root, args, ctx) => {
      return await ctx.connectors.tasks.relevantTasksByPvId.load(root.id);
    },
    countCompletedTasks: async (root, args, ctx) => {
      const data = await ctx.connectors.tasks.completedTasksCountByPvId.load(root.id);
      return data && data.countCompletedTasks ? data.countCompletedTasks : 0;
    },
    countAvailableTasks: async (root, args, ctx) => {
      const data = await ctx.connectors.tasks.availableTasksCountByPvId.load(root.id);
      return data && data.countAvailableTasks ? data.countAvailableTasks : 0;
    },
    pointsEarned: async (root, args, ctx) => {
      const data = await ctx.connectors.potentialVoters.PvPointsById.load(root.id);
      return data && data.earned ? data.earned : 0;
    },
    pointsPotential: async (root, args, ctx) => {
      const data = await ctx.connectors.potentialVoters.PvPointsById.load(root.id);
      return data && data.potential ? data.potential : 0;
    },
    taskPoints: async (root, args, ctx) => {
      const data = await ctx.connectors.tasks.taskPointsById.load(root.id);
      return data && data.total_task_points ? data.total_task_points : 0;
    },
    voterFileRecord: async (root, args, ctx) => {
      if (!root.state_file_id) return {};
      return ctx.connectors.voters.voterById.load(root.state_file_id);
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
