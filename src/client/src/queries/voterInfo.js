import gql from 'graphql-tag';

const VOTER_INFO = gql`
  query voterInfo($state_file_id: String!) {
    voter(where: { state_file_id: $state_file_id }) {
      state_file_id
      first_name
      middle_name
      last_name
      home_address
      city
      state
      zipcode
      dob_iso8601
      vo_ab_requested
      vo_ab_requested_iso8601
      vo_voted
      vo_voted_iso8601
      vo_voted_method
    }
  }
`;

export default VOTER_INFO;
