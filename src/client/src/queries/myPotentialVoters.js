import gql from 'graphql-tag';

const MY_POTENTIAL_VOTERS = gql`
  query myPotentialVoters($org_id: String!) {
    myPotentialVoters(org_id: $org_id) {
      id
      first_name
      last_name
      city
      user_email
      org_id
      state_file_id
      countCompletedTasks
      countAvailableTasks
      voPoints
      taskPoints
    }
  }
`;

export default MY_POTENTIAL_VOTERS;
