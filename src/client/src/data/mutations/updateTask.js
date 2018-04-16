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
  }
`;

export default UPDATE_TASK;
