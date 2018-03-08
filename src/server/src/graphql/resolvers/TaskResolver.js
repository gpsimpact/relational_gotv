export default {
  Mutation: {
    updateTask(root, args, ctx) {
      console.log('HERERERE??');
      return ctx.models.tasks.updateTask(args, ctx);
    },
  },
};
