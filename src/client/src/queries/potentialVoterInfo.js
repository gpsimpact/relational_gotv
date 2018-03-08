import gql from 'graphql-tag';

const POTENTIAL_VOTER_INFO = gql`
  query potentialVoterInfo($id: String!) {
    potentialVoterInfo(id: $id) {
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
      nextTask {
        id
        form_schema
      }
    }
  }
`;

export default POTENTIAL_VOTER_INFO;
