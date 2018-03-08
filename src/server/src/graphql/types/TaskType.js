export default `
  
  enum TaskStatusEnum {
    COMPLETE
    INCOMPLETE
    INPROGRESS
    SKIPPED
  }

  type Task {
    id: String!
    form_schema: JSON
    potential_voter: PotentialVoter
    form_data: JSON
    point_value: Int
    sequence: Int
    created_at: isoDateTime
    updated_at: isoDateTime
    description: String
    not_visible_before: isoDateTime
    not_visible_after: isoDateTime
    status: TaskStatusEnum
  }

  type Mutation {
    updateTask(id: String!, status: TaskStatusEnum!, form_data: JSON): Task
  }

`;
