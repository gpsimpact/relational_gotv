import { mergeResolvers } from 'merge-graphql-schemas';
import OrganizationResolver from './OrganizationResolver';
import StatusResolver from './StatusResolver';
import UserResolver from './UserResolver';
import PotentialVoterResolver from './PotentialVoter';
import VoterResolver from './VoterResolver';

const resolvers = [
  OrganizationResolver,
  StatusResolver,
  UserResolver,
  PotentialVoterResolver,
  VoterResolver,
];

export default mergeResolvers(resolvers);
