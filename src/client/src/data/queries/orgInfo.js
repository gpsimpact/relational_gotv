import gql from 'graphql-tag';

const ORG_DETAILS = gql`
  query GetOrgInfo($where: OrganizationWhereUniqueInput!) {
    organization(where: $where) {
      id
      name
      cta
      slug
      contact_name
      contact_email
      contact_phone
      admin_notes
    }
  }
`;

export default ORG_DETAILS;
