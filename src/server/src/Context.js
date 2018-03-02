import sqlDb from './db';
import RegistrantConnector from './connectors/registrants';
import UserConnector from './connectors/users';
import OrganizationPermissionsConnector from './connectors/organizationPermissions';
import OrganizationConnector from './connectors/organization';
import sendEmail from './connectors/email';
import RegistrantModel from './models/registrants';
import UserModel from './models/users';
import OrganizationPermissionModel from './models/organizationPermissions';
import PotentialVotersConnector from './connectors/potentialVoters';
import PotentialVotersModel from './models/potentialVoters';

class MakeContext {
  constructor(request) {
    this.request = request;

    this.connectors = {
      registrant: { ...new RegistrantConnector({ sqlDb }) },
      user: { ...new UserConnector({ sqlDb }) },
      organizationPermissions: { ...new OrganizationPermissionsConnector({ sqlDb }) },
      organization: { ...new OrganizationConnector({ sqlDb }) },
      sendEmail,
      potentialVoters: { ...new PotentialVotersConnector({ sqlDb }) },
    };

    this.models = {
      registrant: { ...new RegistrantModel() },
      user: { ...new UserModel() },
      organizationPermissions: { ...new OrganizationPermissionModel() },
      potentialVoters: { ...new PotentialVotersModel() },
    };
  }

  get user() {
    return this.request.user;
  }

  // ensureIsAuthenticated() {
  //   // https://github.com/kriasoft/nodejs-api-starter/blob/master/src/errors.js
  //   if (!this.user) throw new UnauthorizedError();
  // }
}

export default MakeContext;
