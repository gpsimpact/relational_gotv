import gql from 'graphql-tag';

const RESET_PASS_MUTATION = gql`
  mutation resetPassword($token: String!, $newPassword: String!) {
    resetPassword(data: { token: $token, newPassword: $newPassword })
  }
`;

export default RESET_PASS_MUTATION;
