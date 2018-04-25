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
      dob
      vo_ab_requested_primary
      vo_ab_requested_date_primary
      vo_voted_primary
      vo_voted_date_primary
      vo_voted_method_primary
      vo_ab_requested_general
      vo_ab_requested_date_general
      vo_voted_general
      vo_voted_date_general
      vo_voted_method_general
    }
  }
`;

export default VOTER_INFO;
