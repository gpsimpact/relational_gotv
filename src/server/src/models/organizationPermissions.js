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
  addOrganizationPermission = async ({ organizationHash, userEmail, permission }, ctx) => {
    if (hasPermission(ctx.user, organizationHash, 'ADMIN', true)) {
      await ctx.connectors.organizationPermissions.addOrganizationPermission(
        organizationHash,
        userEmail,
        permission
      );

      const orgProfile = await ctx.connectors.organization.organizationByHash.load(
        organizationHash
      );

      const orgPermissions = await ctx.connectors.organizationPermissions.organizationPermissions.load(
        organizationHash
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

  removeOrganizationPermission = async ({ organizationHash, userEmail, permission }, ctx) => {
    if (hasPermission(ctx.user, organizationHash, 'ADMIN', true)) {
      await ctx.connectors.organizationPermissions.removeOrganizationPermission(
        organizationHash,
        userEmail,
        permission
      );

      const orgProfile = await ctx.connectors.organization.organizationByHash.load(
        organizationHash
      );

      const orgPermissions = await ctx.connectors.organizationPermissions.organizationPermissions.load(
        organizationHash
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
