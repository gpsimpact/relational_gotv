export default {
  Voter: {
    // The following 3 modifications are important because deserialization of
    // cache is messing with format of time
    dob(root) {
      if (typeof root.dob === 'string') {
        return root.dob.split('T')[0];
      }
      return root.dob;
    },
    vo_ab_requested_date_primary(root) {
      if (typeof root.vo_ab_requested_date_primary === 'string') {
        return root.vo_ab_requested_date_primary.split('T')[0];
      }
      return root.vo_ab_requested_date_primary;
    },
    vo_voted_date_primary(root) {
      if (typeof root.vo_voted_date_primary === 'string') {
        return root.vo_voted_date_primary.split('T')[0];
      }
      return root.vo_voted_date_primary;
    },
    vo_ab_requested_date_general(root) {
      if (typeof root.vo_ab_requested_date_general === 'string') {
        return root.vo_ab_requested_date_general.split('T')[0];
      }
      return root.vo_ab_requested_date_general;
    },
    vo_voted_date_general(root) {
      if (typeof root.vo_voted_date_general === 'string') {
        return root.vo_voted_date_general.split('T')[0];
      }
      return root.vo_voted_date_general;
    },
  },
  Query: {
    voters(root, args, ctx) {
      return ctx.models.voters.voterMultiSearch(args, ctx);
    },
    voter(root, args, ctx) {
      return ctx.models.voters.voterSingleSearch(args, ctx);
    },
  },
};
