import { mergeResolvers } from 'merge-graphql-schemas';
import OrganizationResolver from './OrganizationResolver';
import StatusResolver from './StatusResolver';
import UserResolver from './UserResolver';
import PotentialVoterResolver from './PotentialVoterResolver';
import VoterResolver from './VoterResolver';
import ScalarJSONResolver from './ScalarJSONResolver';
import ScalarISODatesResolver from './ScalarISODatesResolver';
import TaskResolver from './TaskResolver';
import PointsResolver from './PointsResolver';

const resolvers = [
  OrganizationResolver,
  StatusResolver,
  UserResolver,
  PotentialVoterResolver,
  VoterResolver,
  ScalarJSONResolver,
  ScalarISODatesResolver,
  TaskResolver,
  PointsResolver,
];

export default mergeResolvers(resolvers);
