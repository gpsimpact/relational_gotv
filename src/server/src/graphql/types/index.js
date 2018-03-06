import { mergeTypes } from 'merge-graphql-schemas';
import organizationType from './OrganizationType';
import potentialVoterType from './PotentialVoterType';
import statusType from './StatusType';
import userType from './UserType';
import voterType from './VoterType';

const types = [organizationType, potentialVoterType, statusType, userType, voterType];

// NOTE: 2nd param is optional, and defaults to false
// Only use if you have defined the same type multiple times in
// different files and wish to attempt merging them together.
export default mergeTypes(types, { all: true });
