import gql from 'graphql-tag';

const VOTER_SEARCH = gql`
  query voterSearch($first_name: String, $last_name: String, $city: String, $state: String) {
    voters(
      where: {
        first_name_starts_with: $first_name
        last_name_starts_with: $last_name
        city_starts_with: $city
        state_is: $state
      }
    ) {
      items {
        state_file_id
        first_name
        middle_name
        last_name
        home_address
        city
        state
        zipcode
        dob
        vo_ab_requested
        vo_ab_requested_date
        vo_voted
        vo_voted_date
        vo_voted_method
      }
    }
  }
`;

export default VOTER_SEARCH;
