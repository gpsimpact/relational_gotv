import gql from 'graphql-tag';

const ALL_ORGS = gql`
  query organizations(
    $where: OrganizationWhereInput
    $orderBy: [OrganizationOrdering!]
    $limit: Int
    $after: String
  ) {
    organizations(where: $where, orderBy: $orderBy, limit: $limit, after: $after) {
      items {
        id
        name
        cta
        slug
        contact_name
        contact_email
        contact_phone
      }
    }
  }
`;

export default ALL_ORGS;
