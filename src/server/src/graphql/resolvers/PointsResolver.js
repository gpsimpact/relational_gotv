export default {
  Query: {
    points(root, args, ctx) {
      return ctx.models.points.pointsMultiSearch(args, ctx);
    },
  },
};
