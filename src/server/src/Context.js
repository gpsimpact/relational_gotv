import sqlDb from './db';
import redisDb from './redisClient';
import UserConnector from './connectors/users';
import OrganizationPermissionsConnector from './connectors/organizationPermissions';
import OrganizationConnector from './connectors/organizationConnector';
import sendEmail from './connectors/email';
import UserModel from './models/users';
import OrganizationPermissionModel from './models/organizationPermissions';
import OrganizationalInfoModel from './models/organizationInfoModel';
import PotentialVotersConnector from './connectors/potentialVotersConnector';
import PotentialVotersModel from './models/potentialVotersModel';
import VoterConnector from './connectors/votersConnector';
import VoterModel from './models/voterModel';
import TaskConnector from './connectors/tasksConnector';
import TaskModel from './models/taskModel';
import PageConnector from './connectors/pageConnector';
import PointsModel from './models/pointsModel';
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
      tasks: { ...new TaskConnector({ sqlDb }) },
      page: { ...new PageConnector({ sqlDb, redisDb }) },
    };

    this.models = {
      user: { ...new UserModel() },
      organizationPermissions: { ...new OrganizationPermissionModel() },
      organizationalInfo: { ...new OrganizationalInfoModel() },
      potentialVoters: { ...new PotentialVotersModel() },
      voters: { ...new VoterModel() },
      tasks: { ...new TaskModel() },
      points: { ...new PointsModel() },
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
