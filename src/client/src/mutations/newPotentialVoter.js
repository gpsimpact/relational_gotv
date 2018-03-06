import gql from 'graphql-tag';

const NEW_POTENTIAL_VOTER = gql`
  mutation createPotentialVoter($data: PotentialVoterInput!) {
    createPotentialVoter(data: $data) {
      id
      first_name
      last_name
      city
      user_email
      org_id
      state_file_id
      vo_ab_requested
      vo_ab_requested_iso8601
      vo_voted
      vo_voted_iso8601
      vo_voted_method
    }
  }
`;

export default NEW_POTENTIAL_VOTER;
