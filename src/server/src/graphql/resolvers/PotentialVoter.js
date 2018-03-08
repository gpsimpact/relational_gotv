export default {
  PotentialVoter: {
    nextTask: async (root, args, ctx) => await ctx.connectors.tasks.nextTaskByPvId.load(root.id),
    countCompletedTasks: async (root, args, ctx) => {
      const data = await ctx.connectors.tasks.completedTasksCountByPvId.load(root.id);
      return data.countCompletedTasks;
    },
    countAvailableTasks: async (root, args, ctx) => {
      const data = await ctx.connectors.tasks.availableTasksCountByPvId.load(root.id);
      return data.countAvailableTasks;
    },
    voPoints: async (root, args, ctx) => {
      // this may be long enough to break into its own model method.
      if (root.state_file_id) {
        const data = await ctx.connectors.voters.voterPointsById.load(root.state_file_id);
        return data.total_vo_points;
      }
      return 0;
    },
    taskPoints: async (root, args, ctx) => {
      const data = await ctx.connectors.tasks.taskPointsById.load(root.id);
      return data.total_task_points;
    },
  },
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
