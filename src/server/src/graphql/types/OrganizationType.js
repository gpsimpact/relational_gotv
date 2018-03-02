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

  type Mutation {
    addOrganizationPermission(organizationId: String!, permission: PermissionEnum!, userEmail: String!): OrganizationPermissions!
    removeOrganizationPermission(organizationId: String!, permission: PermissionEnum!, userEmail: String!): OrganizationPermissions!
  }

  type Query {
    organizationInfo(slug: String!): Organization
  }
`;
