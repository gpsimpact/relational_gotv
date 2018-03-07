import gql from 'graphql-tag';

const VOTER_SEARCH = gql`
  query voterSearch($first_name: String, $last_name: String, $city: String, $state: String) {
    voters(
      whereLike: { first_name: $first_name }
      where: { last_name: $last_name, city: $city, state: $state }
    ) {
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

export default VOTER_SEARCH;
