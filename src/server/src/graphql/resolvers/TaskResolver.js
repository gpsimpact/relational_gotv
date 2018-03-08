export default {
  Mutation: {
    updateTask(root, args, ctx) {
      return ctx.models.tasks.updateTask(args, ctx);
    },
  },
};
