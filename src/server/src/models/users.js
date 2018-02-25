import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { map, has, pick } from 'lodash';
import buildEmail from '../email';
import {
  DuplicateRegistrationError,
  AuthError,
  NoValidUserError,
  InvalidTokenError,
} from '../errors';

class UserModel {
  register = async ({ email, password, first_name, last_name }, ctx) => {
    // search db for matching emails
    const prevUser = await ctx.connectors.user.userByEmail.load(email);
    if (prevUser) {
      throw new DuplicateRegistrationError({ data: { email } });
    }

    const hash = bcrypt.hashSync(password, 10);
    const newUser = await ctx.connectors.user.createNewUser({
      email,
      password,
      first_name,
      last_name,
      password: hash,
      email_verified: false,
    });

    return await ctx.connectors.user.userByEmail
      .clear(email)
      .prime(email, newUser[0])
      .load(email);
  };

  login = async ({ email, password }, ctx) => {
    // hit DB for accounts with that email
    const dbUserRecord = await ctx.connectors.user.userByEmail.load(email);
    if (!dbUserRecord) {
      throw new AuthError();
    }
    if (!bcrypt.compareSync(password, dbUserRecord.password)) {
      throw new AuthError();
    }
    const userServicePermissionsRaw = await ctx.connectors.organizationPermissions.permissionsByEmail.load(
      email
    );

    const permsByService = {};
    map(userServicePermissionsRaw, permission => {
      if (has(permsByService, permission.service_id)) {
        permsByService[permission.org_hash].push(permission.permission);
      } else {
        permsByService[permission.org_hash] = [permission.permission];
      }
    });

    const tokenPayload = {
      email,
      permissions: permsByService,
    };
    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET);
    return {
      userProfile: dbUserRecord,
      token,
    };
  };

  changePassword = async ({ currentPassword, newPassword }, ctx) => {
    if (!ctx.user || !ctx.user.email) {
      throw new NoValidUserError();
    }

    const dbUserRecord = await ctx.connectors.user.userByEmail.load(ctx.user.email);

    // is the user passed via context valid?
    if (!dbUserRecord) {
      throw new NoValidUserError();
    }

    // does current password match one on file?
    if (!bcrypt.compareSync(currentPassword, dbUserRecord.password)) {
      throw new AuthError();
    }

    // all checks clear, go ahead.
    const hash = bcrypt.hashSync(newPassword, 10);
    const update = await ctx.connectors.user.updateUserByEmail(ctx.user.email, { password: hash });

    // is this necessary to prime the dataloader here?
    ctx.connectors.user.userByEmail.clear(ctx.user.email).prime(ctx.user.email, update[0]);

    return 'ok';
  };

  sendVerificationEmail = ({ email, base_url }, ctx) => {
    const emailVerificationToken = jwt.sign({ email }, process.env.JWT_SECRET);
    const content = buildEmail('verifyEmail', { emailVerificationToken, base_url });
    const messageData = {
      from: process.env.MAILGUN_EMAIL_SENDER,
      to: email,
      subject: content.subject,
      html: content.html,
      txt: content.txt,
    };
    ctx.connectors.sendEmail(messageData).catch(err => console.log(err));
    return 'ok';
  };

  verifyEmailToken = async ({ token }, ctx) => {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const update = await ctx.connectors.user.updateUserByEmail(decoded.email, {
        email_verified: true,
      });

      // is this necessary to prime the dataloader here?
      await ctx.connectors.user.userByEmail.clear(decoded.email).prime(decoded.email, update[0]);

      return 'ok';
    } catch (err) {
      throw new InvalidTokenError();
    }
  };

  sendPasswordResetEmail = async ({ email, base_url }, ctx) => {
    const token = jwt.sign({ email }, process.env.JWT_SECRET);
    const content = buildEmail('resetPassword', { token, base_url });
    const messageData = {
      from: process.env.MAILGUN_EMAIL_SENDER,
      to: email,
      subject: content.subject,
      html: content.html,
      txt: content.txt,
    };
    ctx.connectors.sendEmail(messageData).catch(err => console.log(err));
    return 'ok';
  };

  resetPassword = async ({ token, newPassword }, ctx) => {
    let email;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      email = decoded.email;
    } catch (err) {
      throw new InvalidTokenError();
    }

    const dbUserRecord = await ctx.connectors.user.userByEmail.load(email);
    if (!dbUserRecord) {
      throw new NoValidUserError();
    }

    // all checks clear, go ahead.
    const hash = bcrypt.hashSync(newPassword, 10);

    const update = await ctx.connectors.user.updateUserByEmail(email, {
      password: hash,
    });

    // is this necessary to prime the dataloader here?
    await ctx.connectors.user.userByEmail.clear(email).prime(email, update[0]);

    return 'ok';
  };

  updateProfile = async (data, ctx) => {
    if (!ctx.user || !ctx.user.email) {
      throw new NoValidUserError();
    }
    // todo. This is hacky. Need to filter out and only allow certain values and if exist transform to db casing
    const approvedData = pick(data, ['first_name', 'last_name']);
    const submitData = {};
    if (has(approvedData, 'first_name')) submitData.first_name = approvedData.first_name;
    if (has(approvedData, 'last_name')) submitData.last_name = approvedData.last_name;

    const update = await ctx.connectors.user.updateUserByEmail(ctx.user.email, submitData);

    return await ctx.connectors.user.userByEmail
      .clear(ctx.user.email)
      .prime(ctx.user.email, update[0])
      .load(ctx.user.email);
  };
}

export default UserModel;
