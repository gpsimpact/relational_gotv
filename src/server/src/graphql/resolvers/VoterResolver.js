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
    vo_ab_requested_date(root) {
      if (typeof root.vo_ab_requested_date === 'string') {
        return root.vo_ab_requested_date.split('T')[0];
      }
      return root.vo_ab_requested_date;
    },
    vo_voted_date(root) {
      if (typeof root.vo_voted_date === 'string') {
        return root.vo_voted_date.split('T')[0];
      }
      return root.vo_voted_date;
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
