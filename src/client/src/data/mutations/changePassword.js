import gql from 'graphql-tag';

const CHANGE_PASS_MUTATION = gql`
  mutation changePassword($currentPassword: String!, $newPassword: String!) {
    changePassword(data: { currentPassword: $currentPassword, newPassword: $newPassword })
  }
`;

export default CHANGE_PASS_MUTATION;
