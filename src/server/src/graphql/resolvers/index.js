import { mergeResolvers } from 'merge-graphql-schemas';
import OrganizationResolver from './OrganizationResolver';
import RegistrantResolver from './RegistrantResolver';
import StatusResolver from './StatusResolver';
import UserResolver from './UserResolver';
import PotentialVoterResolver from './PotentialVoter';

const resolvers = [
  OrganizationResolver,
  RegistrantResolver,
  StatusResolver,
  UserResolver,
  PotentialVoterResolver,
];

export default mergeResolvers(resolvers);
