export default `
  type PointProfile {
    organization: Organization
    user: UserProfile
    earned: Int
    potential: Int
  }

  input PointsWhereInput {
    AND: [PotentialVoterWhereInput!]
    OR: [PotentialVoterWhereInput!]
    
    user_email_is: String
    user_email_not: String
    user_email_in: [String!]
    user_email_not_in: [String!]
    user_email_lt: String
    user_email_lte: String
    user_email_gt: String
    user_email_gte: String
    user_email_contains: String
    user_email_not_contains: String
    user_email_starts_with: String
    user_email_not_starts_with: String
    user_email_ends_with: String
    user_email_not_ends_with: String

    org_id_is: String
    org_id_not: String
    org_id_in: [String!]
    org_id_not_in: [String!]
    org_id_lt: String
    org_id_lte: String
    org_id_gt: String
    org_id_gte: String
    org_id_contains: String
    org_id_not_contains: String
    org_id_starts_with: String
    org_id_not_starts_with: String
    org_id_ends_with: String
    org_id_not_ends_with: String

    earned_lt: Int
    earned_lte: Int
    earned_gt: Int
    earned_gte: Int

    potential_lt: Int
    potential_lte: Int
    potential_gt: Int
    potential_gte: Int

  }

  input PointsOrdering {
    sort: PointSort!
    direction: Direction! = ASC
  }
  enum PointSort { user_email, org_id, earned, potential }

  type PointResults {
    items: [PointProfile!]
    response_metadata: Response_Metadata
  }

  type Query {
    points(where: PointsWhereInput, orderBy: [PointsOrdering!], limit: Int, after: String ): PointResults!
  }
`;
