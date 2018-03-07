import gql from 'graphql-tag';

const ASSOCIATE_PV_VOTER = gql`
  mutation createPotentialVoter($pv_id: String!, $voter_id: String) {
    createPotentialVoter(data: { id: $pv_id, state_file_id: $voter_id }) {
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

export default ASSOCIATE_PV_VOTER;
