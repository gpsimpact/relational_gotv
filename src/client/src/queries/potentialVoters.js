import gql from 'graphql-tag';

const MY_POTENTIAL_VOTERS = gql`
  query potentialVoters($org_id: String!, $limit: Int!, $after: String) {
    potentialVoters(
      where: { org_id_is: $org_id }
      orderBy: [{ sort: last_name, direction: ASC }, { sort: first_name, direction: ASC }]
      limit: $limit
      after: $after
    ) {
      items {
        id
        first_name
        last_name
        city
        user_email
        org_id
        state_file_id
        countCompletedTasks
        countAvailableTasks
      }
      pageInfo {
        nextCursor
        totalCount
      }
    }
  }
`;

export default MY_POTENTIAL_VOTERS;
