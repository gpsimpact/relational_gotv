import gql from 'graphql-tag';

const VOTER_SEARCH = gql`
  query voters($first_name: String, $last_name: String, $city: String, $state: String) {
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
      pageInfo {
        nextCursor
        totalCount
      }
    }
  }
`;

export default VOTER_SEARCH;
