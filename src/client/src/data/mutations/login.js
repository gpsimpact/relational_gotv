import gql from 'graphql-tag';

const LOGIN_MUTATION = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      userProfile {
        first_name
        last_name
        email
        email_verified
      }
      token
    }
  }
`;

export default LOGIN_MUTATION;
