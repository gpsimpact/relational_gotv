export default `
  type PotentialVoter {
    id: String!
    first_name: String!
    last_name: String!
    city: String!
    user_email: String!
    org_id: String!
    nextTask: Task
    countCompletedTasks: Int
    countAvailableTasks: Int
    voPoints: Int
    taskPoints: Int
    voterFileRecord: Voter
    deleted: Boolean
  }

  input PotentialVoterInput {
    id: String
    first_name: String
    last_name: String
    city: String
    user_email: String
    state_file_id: String
    org_id: String
  }

  input UpdatePotentialVoterInput {
    first_name: String
    last_name: String
    city: String
    state_file_id: String
    deleted: Boolean
  }


  input PotentialVoterWhereInput {
    AND: [PotentialVoterWhereInput!]
    OR: [PotentialVoterWhereInput!]
    
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

    deleted_is: Boolean
  }

  input PotentialVoterWhereUniqueInput {
    id: String
  }

  input PotentialVoterOrdering {
    sort: PotentialVoterSort!
    direction: Direction! = ASC
  }
  enum PotentialVoterSort { first_name, last_name, city }

  type PotentialVotersResults {
    items: [PotentialVoter!]
    pageInfo: PageInfo
  }

  type Query {
    potentialVoters(where: PotentialVoterWhereInput, orderBy: [PotentialVoterOrdering!], limit: Int, after: String ): PotentialVotersResults!
    potentialVoter(where: PotentialVoterWhereUniqueInput!): PotentialVoter
  }

  type Mutation {
    createPotentialVoter(data: PotentialVoterInput!): PotentialVoter
    updatePotentialVoter(id: String!, data: UpdatePotentialVoterInput): PotentialVoter
  }
`;

const trashbin = `
  type Query {
    myPotentialVoters(org_id: String!): [PotentialVoter]
    potentialVoterInfo(id: String!): PotentialVoter
  }
`;
