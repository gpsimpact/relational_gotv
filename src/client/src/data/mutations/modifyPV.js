import gql from 'graphql-tag';

const UPDATE_PV = gql`
  mutation updatePotentialVoter($id: String!, $data: UpdatePotentialVoterInput!) {
    updatePotentialVoter(id: $id, data: $data) {
      id
      first_name
      last_name
      city
      user_email
      org_id
      countCompletedTasks
      countAvailableTasks
      voterFileRecord {
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
      nextTask {
        id
        form_schema
        point_value
      }
    }
  }
`;

export default UPDATE_PV;
