export default {
  Query: {
    dataDates: () => ({
      voterFileDate: process.env.VOTER_FILE_DATE,
      earlyVoteDataDate: process.env.EARLY_VOTE_DATA_DATE,
    }),
  },
};
