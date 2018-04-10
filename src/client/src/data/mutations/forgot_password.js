import gql from 'graphql-tag';

const FORGOT_PASS_MUTATION = gql`
  mutation sendPasswordResetEmail($email: String!, $base_url: String!) {
    sendPasswordResetEmail(email: $email, base_url: $base_url)
  }
`;

export default FORGOT_PASS_MUTATION;
