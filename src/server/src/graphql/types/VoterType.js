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
    dob_iso8601: String
    vo_ab_requested: Boolean
    vo_ab_requested_iso8601: String
    vo_voted: Boolean
    vo_voted_iso8601: String
    vo_voted_method: String
  }

  input VoterSearchWhereInput {
    state_file_id: String
    last_name: String
    city: String
    state: String
  }

  input VoterSearchWhereLikeInput {
    first_name: String
  }

  #input VoterSearchWhereInInput {
  #  state_file_id: String
  #}

  input VoterSearchInput {
    # exact match search
    where: VoterSearchWhereInput
    # Uses case insensitive partial string matching
    whereLike: VoterSearchWhereLikeInput
  }

  type Query {
    voters(where: VoterSearchWhereInput, whereLike: VoterSearchWhereLikeInput ): [Voter]
    voter(where: VoterSearchWhereInput ): Voter
  }

`;
