import sqlDb from './db';
import UserConnector from './connectors/users';
import OrganizationPermissionsConnector from './connectors/organizationPermissions';
import OrganizationConnector from './connectors/organization';
import sendEmail from './connectors/email';
import UserModel from './models/users';
import OrganizationPermissionModel from './models/organizationPermissions';
import PotentialVotersConnector from './connectors/potentialVoters';
import PotentialVotersModel from './models/potentialVoters';
import VoterConnector from './connectors/voters';
import VoterModel from './models/voterModel';
import { UnauthorizedError } from './errors';

class MakeContext {
  constructor(request) {
    this.request = request;

    this.connectors = {
      user: { ...new UserConnector({ sqlDb }) },
      organizationPermissions: { ...new OrganizationPermissionsConnector({ sqlDb }) },
      organization: { ...new OrganizationConnector({ sqlDb }) },
      sendEmail,
      potentialVoters: { ...new PotentialVotersConnector({ sqlDb }) },
      voters: { ...new VoterConnector({ sqlDb }) },
    };

    this.models = {
      user: { ...new UserModel() },
      organizationPermissions: { ...new OrganizationPermissionModel() },
      potentialVoters: { ...new PotentialVotersModel() },
      voters: { ...new VoterModel() },
    };
  }

  get user() {
    return this.request.user;
  }

  ensureIsAuthenticated() {
    if (!this.user) throw new UnauthorizedError();
  }
}

export default MakeContext;
