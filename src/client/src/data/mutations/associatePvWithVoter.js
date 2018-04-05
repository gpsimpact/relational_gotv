import gql from 'graphql-tag';

const ASSOCIATE_PV_VOTER = gql`
  mutation updatePotentialVoter($pv_id: String!, $voter_id: String) {
    updatePotentialVoter(id: $pv_id, data: { state_file_id: $voter_id }) {
      id
      first_name
      last_name
      city
      user_email
      org_id
      state_file_id
    }
  }
`;

export default ASSOCIATE_PV_VOTER;
