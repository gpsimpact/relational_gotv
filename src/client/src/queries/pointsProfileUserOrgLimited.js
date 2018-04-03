import gql from 'graphql-tag';

const POINTS_PROFILE_USER_ORG_LIMITED = gql`
  query points($email: String!, $org_id: String!) {
    points(where: { user_email_is: $email, org_id_is: $org_id }) {
      items {
        organization {
          id
        }
        earned
        potential
      }
    }
  }
`;

export default POINTS_PROFILE_USER_ORG_LIMITED;
