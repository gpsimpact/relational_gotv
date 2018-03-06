export default `
  type PotentialVoter {
    id: String!
    first_name: String!
    last_name: String!
    city: String!
    user_email: String!
    org_id: String!
    state_file_id: String
    vo_ab_requested: Boolean
    vo_ab_requested_iso8601: String
    vo_voted: Boolean
    vo_voted_iso8601: String
    vo_voted_method: String
  }

  input PotentialVoterInput {
    id: String
    first_name: String
    last_name: String
    city: String
    user_email: String
    state_file_id: String
    vo_ab_requested: Boolean
    vo_ab_requested_iso8601: String
    vo_voted: Boolean
    vo_voted_iso8601: String
    vo_voted_method: String
    org_id: String
  }

  type Query {
    myPotentialVoters(org_id: String!): [PotentialVoter]
    potentialVoterInfo(id: String!): PotentialVoter
  }

  type Mutation {
    createPotentialVoter(data: PotentialVoterInput!): PotentialVoter
  }
`;
