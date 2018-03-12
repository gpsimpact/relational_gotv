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
    }
  }
`;

export default NEW_POTENTIAL_VOTER;
