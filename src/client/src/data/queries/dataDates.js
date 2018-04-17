import gql from 'graphql-tag';

const DATA_DATES = gql`
  query {
    dataDates {
      voterFileDate
      earlyVoteDataDate
    }
  }
`;

export default DATA_DATES;
