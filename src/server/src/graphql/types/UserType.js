export default `
input RegisterUserInput {
  # the User first name
  first_name: String!
  # the user last name
  last_name: String!
  # the user email. Must be real address to complete registration process
  email: String!
  # password
  password: String!
  # Organization_id
  org_id: String!
}

type UserProfile {
  first_name: String
  last_name: String
  email: String!
  email_verified: Boolean
}

type LoginResult {
  userProfile: UserProfile
  token: String
}

input ChangePasswordInput {
  # existing password
  currentPassword: String!
  # new password
  newPassword: String!
}

input ResetPasswordInput {
  # email address
  token: String!
  # new password
  newPassword: String!
}

input UpdateProfileInput {
  # the User first name
  first_name: String
  # the user last name
  last_name: String
}


type Mutation {
  registerUser(user: RegisterUserInput): UserProfile!
  login(email: String!, password: String!): LoginResult
  changePassword(data:ChangePasswordInput): String!
  sendVerificationEmail(email: String!, base_url: String!): String!
  verifyEmailAddress(token: String!): String!
  sendPasswordResetEmail(email: String!, base_url: String!): String!
  resetPassword(data: ResetPasswordInput!): String!
  updateProfile(data: UpdateProfileInput): UserProfile!
}
`;
