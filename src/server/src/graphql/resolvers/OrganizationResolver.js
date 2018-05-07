import { hasPermission } from '../../utils';
export default {
  Organization: {
    admin_notes: async (root, args, ctx) => {
      if (hasPermission(ctx.user, root.id, 'ADMIN', false)) {
        return root.admin_notes;
      }
      return null;
    },
  },
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
