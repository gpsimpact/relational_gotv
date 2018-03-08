import { mergeResolvers } from 'merge-graphql-schemas';
import OrganizationResolver from './OrganizationResolver';
import StatusResolver from './StatusResolver';
import UserResolver from './UserResolver';
import PotentialVoterResolver from './PotentialVoter';
import VoterResolver from './VoterResolver';
import ScalarJSONResolver from './ScalarJSONResolver';
import ScalarISODatesResolver from './ScalarISODatesResolver';
import TaskResolver from './TaskResolver';

const resolvers = [
  OrganizationResolver,
  StatusResolver,
  UserResolver,
  PotentialVoterResolver,
  VoterResolver,
  ScalarJSONResolver,
  ScalarISODatesResolver,
  TaskResolver,
];

export default mergeResolvers(resolvers);
