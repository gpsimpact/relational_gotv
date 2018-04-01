import gql from 'graphql-tag';

const POTENTIAL_VOTER_INFO = gql`
  query potentialVoter($id: String!) {
    potentialVoter(where: { id: $id }) {
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
        point_value
      }
    }
  }
`;

export default POTENTIAL_VOTER_INFO;
