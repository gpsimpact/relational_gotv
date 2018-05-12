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
      countCompletedTasks
      countAvailableTasks
      pointsEarned
      pointsPotential
      taskPoints
      voterFileRecord {
        state_file_id
        first_name
        last_name
      }
      nextTask {
        id
        form_schema
        point_value
      }
      tasks {
        id
        description
        status
        form_schema
        point_value
      }
    }
  }
`;

export default POTENTIAL_VOTER_INFO;
