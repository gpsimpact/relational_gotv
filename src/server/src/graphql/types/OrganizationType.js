export default `
  # A partnering organization
  type Organization {
    id: String!
    name: String!
    cta: String
    slug: String!
    contact_name: String!
    contact_email: String!
    contact_phone: String!
  }

  type OrganizationUserPermission {
    email: String!
    permissions: [String]
  }

  type OrganizationPermissions {
    organization: Organization!
    users: [OrganizationUserPermission]
  }

  enum PermissionEnum {
    READ_ONLY
    ADMIN
  }

  input OrganizationWhereInput {
    AND: [OrganizationWhereInput!]
    OR: [OrganizationWhereInput!]
    
    id_is: String
    id_not: String
    id_in: [String!]
    id_not_in: [String!]
    id_lt: String
    id_lte: String
    id_gt: String
    id_gte: String
    id_contains: String
    id_not_contains: String
    id_starts_with: String
    id_not_starts_with: String
    id_ends_with: String
    id_not_ends_with: String

    name_is: String
    name_not: String
    name_in: [String!]
    name_not_in: [String!]
    name_lt: String
    name_lte: String
    name_gt: String
    name_gte: String
    name_contains: String
    name_not_contains: String
    name_starts_with: String
    name_not_starts_with: String
    name_ends_with: String
    name_not_ends_with: String

    slug_is: String
    slug_not: String
    slug_in: [String!]
    slug_not_in: [String!]
    slug_lt: String
    slug_lte: String
    slug_gt: String
    slug_gte: String
    slug_contains: String
    slug_not_contains: String
    slug_starts_with: String
    slug_not_starts_with: String
    slug_ends_with: String
    slug_not_ends_with: String
  }

  input OrganizationWhereUniqueInput {
    id: String
    slug: String
  }


  input OrganizationOrdering {
    sort: OrganizationSort!
    direction: Direction! = ASC
  }
  enum OrganizationSort { name }

  type OrganizationsResults {
    items: [Organization!]
    pageInfo: PageInfo
  }

  type Query {
    organizations(where: OrganizationWhereInput, orderBy: [OrganizationOrdering!], limit: Int, after: String ): OrganizationsResults!
    organization(where: OrganizationWhereUniqueInput!): Organization
  }

  type Mutation {
    addOrganizationPermission(organizationId: String!, permission: PermissionEnum!, userEmail: String!): OrganizationPermissions!
    removeOrganizationPermission(organizationId: String!, permission: PermissionEnum!, userEmail: String!): OrganizationPermissions!
  }
`;
