import QueryResolver from './Query/Query.resolvers';
import MutationResolver from './Mutation/Mutation.resolvers';
import StatusResolver from './Status/Status.resolvers';

export default {
  ...QueryResolver,
  ...MutationResolver,
  ...StatusResolver,
};
