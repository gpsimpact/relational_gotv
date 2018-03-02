export default {
  Mutation: {
    addOrganizationPermission(root, args, ctx) {
      return ctx.models.organizationPermissions.addOrganizationPermission(args, ctx);
    },
    removeOrganizationPermission(root, args, ctx) {
      return ctx.models.organizationPermissions.removeOrganizationPermission(args, ctx);
    },
  },
  Query: {
    organizationInfo(root, args, ctx) {
      return ctx.connectors.organization.organizationBySlug.load(args.slug);
    },
  },
};
