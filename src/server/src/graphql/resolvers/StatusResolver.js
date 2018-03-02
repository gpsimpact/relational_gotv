export default {
  status: {
    message: root => root.msg,
  },
  Query: {
    status: () => ({ msg: 'GraphQL OK' }),
  },
};
