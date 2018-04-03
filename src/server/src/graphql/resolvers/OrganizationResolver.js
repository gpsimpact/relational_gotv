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
    organizations(root, args, ctx) {
      return ctx.models.organizationalInfo.orgMultiSearch(args, ctx);
    },
    organization(root, args, ctx) {
      return ctx.models.organizationalInfo.orgSingle(args, ctx);
    },
  },
};
