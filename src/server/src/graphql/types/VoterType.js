export default `
  type Voter {
    state_file_id: String
    first_name: String
    middle_name: String
    last_name: String
    home_address: String
    city: String
    state: String
    zipcode: String
    dob: isoDate
    vo_ab_requested_primary: Boolean
    vo_ab_requested_date_primary: isoDate
    vo_voted_primary: Boolean
    vo_voted_date_primary: isoDate
    vo_voted_method_primary: String
    vo_ab_requested_general: Boolean
    vo_ab_requested_date_general: isoDate
    vo_voted_general: Boolean
    vo_voted_date_general: isoDate
    vo_voted_method_general: String
  }


  input VoterWhereInput {
    AND: [VoterWhereInput!]
    OR: [VoterWhereInput!]
    state_file_id_is: String
    state_file_id_not: String
    state_file_id_in: [String!]
    state_file_id_not_in: [String!]
    state_file_id_lt: String
    state_file_id_lte: String
    state_file_id_gt: String
    state_file_id_gte: String
    state_file_id_contains: String
    state_file_id_not_contains: String
    state_file_id_starts_with: String
    state_file_id_not_starts_with: String
    state_file_id_ends_with: String
    state_file_id_not_ends_with: String

    first_name_is: String
    first_name_not: String
    first_name_in: [String!]
    first_name_not_in: [String!]
    first_name_lt: String
    first_name_lte: String
    first_name_gt: String
    first_name_gte: String
    first_name_contains: String
    first_name_not_contains: String
    first_name_starts_with: String
    first_name_not_starts_with: String
    first_name_ends_with: String
    first_name_not_ends_with: String

    last_name_is: String
    last_name_not: String
    last_name_in: [String!]
    last_name_not_in: [String!]
    last_name_lt: String
    last_name_lte: String
    last_name_gt: String
    last_name_gte: String
    last_name_contains: String
    last_name_not_contains: String
    last_name_starts_with: String
    last_name_not_starts_with: String
    last_name_ends_with: String
    last_name_not_ends_with: String

    city_is: String
    city_not: String
    city_in: [String!]
    city_not_in: [String!]
    city_lt: String
    city_lte: String
    city_gt: String
    city_gte: String
    city_contains: String
    city_not_contains: String
    city_starts_with: String
    city_not_starts_with: String
    city_ends_with: String
    city_not_ends_with: String

    state_is: String
    state_not: String
    state_in: [String!]
    state_not_in: [String!]
    state_lt: String
    state_lte: String
    state_gt: String
    state_gte: String
    state_contains: String
    state_not_contains: String
    state_starts_with: String
    state_not_starts_with: String
    state_ends_with: String
    state_not_ends_with: String
  }

  input VoterWhereUniqueInput {
    state_file_id: String
  }

  input VoterOrdering {
    sort: VoterSort!
    direction: Direction! = ASC
  }
  enum VoterSort { first_name, last_name }

  type votersResults {
    items: [Voter!]
    pageInfo: PageInfo
  }

  type Query {
    voters(where: VoterWhereInput, orderBy: [VoterOrdering!], limit: Int, after: String ): votersResults!
    voter(where: VoterWhereUniqueInput ): Voter
  }

`;

const trashbin = `
  enum VoterOrderByInput {
    last_name_ASC
    last_name_DESC
    first_name_ASC
    first_name_DESC
  }

  input Pagination {
    cursor: String
    limit: Int
  }
`;
