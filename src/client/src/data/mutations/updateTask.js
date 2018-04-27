import gql from 'graphql-tag';

const UPDATE_TASK = gql`
  mutation updateTask($id: String!, $status: TaskStatusEnum!, $form_data: JSON!) {
    updateTask(id: $id, status: $status, form_data: $form_data) {
      id
      status
      form_data
      potential_voter {
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
        nextTask {
          id
          form_schema
          point_value
        }
      }
    }
  }
`;

export default UPDATE_TASK;
