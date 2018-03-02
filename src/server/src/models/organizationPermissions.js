// import bcrypt from 'bcrypt';
// import jwt from 'jsonwebtoken';
import { map, has, pick } from 'lodash';
// import buildEmail from '../email';
// import {
//   DuplicateRegistrationError,
//   AuthError,
//   NoValidUserError,
//   InvalidTokenError,
// } from '../errors';
import { hasPermission, mapToMany } from '../utils';

class OrganizationPermissionModel {
  addOrganizationPermission = async ({ organizationId, userEmail, permission }, ctx) => {
    if (hasPermission(ctx.user, organizationId, 'ADMIN', true)) {
      await ctx.connectors.organizationPermissions.addOrganizationPermission(
        organizationId,
        userEmail,
        permission
      );

      const orgProfile = await ctx.connectors.organization.organizationById.load(organizationId);

      const orgPermissions = await ctx.connectors.organizationPermissions.organizationPermissions.load(
        organizationId
      );

      const permsByEmail = new Map();
      orgPermissions.forEach(orgPermission => {
        if (!permsByEmail.has(orgPermission.email)) {
          permsByEmail.set(orgPermission.email, [orgPermission.permission]);
        } else {
          const existingPerms = permsByEmail.get(orgPermission.email);
          const newPerms = existingPerms.push(orgPermission.permission);
          permsByEmail.set(orgPermission.email, newPerms);
        }
      });

      const finalPerms = [];
      permsByEmail.forEach((value, key) => {
        finalPerms.push({ email: key, permissions: value });
      });

      return {
        organization: orgProfile,
        users: finalPerms,
      };
    }
  };

  removeOrganizationPermission = async ({ organizationId, userEmail, permission }, ctx) => {
    if (hasPermission(ctx.user, organizationId, 'ADMIN', true)) {
      await ctx.connectors.organizationPermissions.removeOrganizationPermission(
        organizationId,
        userEmail,
        permission
      );

      const orgProfile = await ctx.connectors.organization.organizationById.load(organizationId);

      const orgPermissions = await ctx.connectors.organizationPermissions.organizationPermissions.load(
        organizationId
      );

      const permsByEmail = new Map();
      orgPermissions.forEach(orgPermission => {
        if (!permsByEmail.has(orgPermission.email)) {
          permsByEmail.set(orgPermission.email, [orgPermission.permission]);
        } else {
          const existingPerms = permsByEmail.get(orgPermission.email);
          const newPerms = existingPerms.push(orgPermission.permission);
          permsByEmail.set(orgPermission.email, newPerms);
        }
      });

      const finalPerms = [];
      permsByEmail.forEach((value, key) => {
        finalPerms.push({ email: key, permissions: value });
      });

      return {
        organization: orgProfile,
        users: finalPerms,
      };
    }
  };
}

export default OrganizationPermissionModel;
