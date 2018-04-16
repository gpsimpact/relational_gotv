import gql from 'graphql-tag';

export const fragments = {
  voterfileFields: gql`
    fragment voterFileFields on Voter {
      state_file_id
      first_name
      middle_name
      last_name
      home_address
      city
      state
      zipcode
      dob
      vo_ab_requested
      vo_ab_requested_date
      vo_voted
      vo_voted_date
      vo_voted_method
    }
  `,
  orgFields: gql`
    fragment organizationFields on Organization {
      id
      name
      cta
      slug
      contact_name
      contact_email
      contact_phone
    }
  `,
  potentialVoterFields: gql`
    fragment potentialVoterFields on PotentialVoter {
      id
      first_name
      last_name
      city
      user_email
      org_id
      countCompletedTasks
      countAvailableTasks
      voPoints
      taskPoints
    }
  `,
  nextTaskFields: gql`
    fragment nextTaskFields on Task {
      id
      form_schema
      point_value
    }
  `,
  pageInfoFields: gql`
    fragment pageInfoFields on PageInfo {
      nextCursor
      totalCount
    }
  `,
};

export const queries = {
  ALL_ORGS: gql`
    query organizations(
      $where: OrganizationWhereInput
      $orderBy: [OrganizationOrdering!]
      $limit: Int
      $after: String
    ) {
      organizations(where: $where, orderBy: $orderBy, limit: $limit, after: $after) {
        items {
          ...organizationFields
        }
      }
    }
  `,
  ORG_DETAILS: gql`
    query GetOrgInfo($where: OrganizationWhereUniqueInput!) {
      organization(where: $where) {
        ...organizationFields
      }
    }
  `,
  POINTS_PROFILE_USER_ORG_LIMITED: gql`
    query points($email: String!, $org_id: String!) {
      points(where: { user_email_is: $email, org_id_is: $org_id }) {
        items {
          organization {
            id
          }
          earned
          potential
        }
      }
    }
  `,
  POTENTIAL_VOTER_INFO: gql`
    query potentialVoter($id: String!) {
      potentialVoter(where: { id: $id }) {
        ...potentialVoterFields
        voterFileRecord {
          ...voterFileFields
        }
        nextTask {
          ...nextTaskFields
        }
      }
    }
  `,
  MY_POTENTIAL_VOTERS: gql`
    query potentialVoters($org_id: String!, $limit: Int!, $after: String) {
      potentialVoters(
        where: { org_id_is: $org_id }
        orderBy: [{ sort: last_name, direction: ASC }, { sort: first_name, direction: ASC }]
        limit: $limit
        after: $after
      ) {
        items {
          ...potentialVoterFields
          voterFileRecord {
            ...voterFileFields
          }
          nextTask {
            ...nextTaskFields
          }
        }
        pageInfo {
          ...pageInfoFields
        }
      }
    }
  `,
  VOTER_SEARCH: gql`
    query voters($first_name: String, $last_name: String, $city: String, $state: String) {
      voters(
        where: {
          first_name_starts_with: $first_name
          last_name_starts_with: $last_name
          city_starts_with: $city
          state_is: $state
        }
      ) {
        items {
          ...voterFileFields
        }
        pageInfo {
          ...pageInfoFields
        }
      }
    }
  `,
};

export default queries;
