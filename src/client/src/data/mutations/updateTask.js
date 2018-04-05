import gql from 'graphql-tag';

const UPDATE_TASK = gql`
  mutation updateTask($id: String!, $status: TaskStatusEnum!, $form_data: JSON!) {
    updateTask(id: $id, status: $status, form_data: $form_data) {
      id
      status
      form_data
    }
  }
`;

export default UPDATE_TASK;
