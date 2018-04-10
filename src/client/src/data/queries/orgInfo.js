import gql from 'graphql-tag';

const ORG_DETAILS = gql`
  query GetOrgInfo($slug: String!) {
    organization(where: { slug: $slug }) {
      id
      name
      cta
      slug
      contact_name
      contact_email
      contact_phone
    }
  }
`;

export default ORG_DETAILS;
