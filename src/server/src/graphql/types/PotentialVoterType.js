export default `
  type PotentialVoter {
    id: String!
    first_name: String!
    last_name: String!
    city: String!
    user_email: String!
    org_id: String!
    state_file_id: String
    nextTask: Task
    countCompletedTasks: Int
    countAvailableTasks: Int
    voPoints: Int
    taskPoints: Int
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
  }

  type Query {
    myPotentialVoters(org_id: String!): [PotentialVoter]
    potentialVoterInfo(id: String!): PotentialVoter
  }

  type Mutation {
    createPotentialVoter(data: PotentialVoterInput!): PotentialVoter
    updatePotentialVoter(id: String!, data: UpdatePotentialVoterInput): PotentialVoter
  }
`;
