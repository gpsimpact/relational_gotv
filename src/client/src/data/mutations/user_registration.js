import gql from 'graphql-tag';

const REGISTRATION_MUTATION = gql`
  mutation registerUser(
    $first_name: String!
    $last_name: String!
    $email: String!
    $password: String!
    $org_id: String!
  ) {
    registerUser(
      user: {
        first_name: $first_name
        last_name: $last_name
        email: $email
        password: $password
        org_id: $org_id
      }
    ) {
      first_name
      last_name
      email
    }
  }
`;

export default REGISTRATION_MUTATION;
