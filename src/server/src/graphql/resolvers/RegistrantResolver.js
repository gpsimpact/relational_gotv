export default {
  Mutation: {
    updateRegistrant(root, args, ctx) {
      return ctx.models.registrant.updateRegistrantById(args.data, ctx);
    },
  },
};
