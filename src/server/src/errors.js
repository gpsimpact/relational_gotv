import { createError } from 'apollo-errors';

export const RecordLockedError = createError('RecordLockedError', {
  message: 'This record has been locked and can not be updated.',
});

export const DuplicateRegistrationError = createError('DuplicateRegistrationError', {
  message: 'This email address is already associated with an account.',
});

export const AuthError = createError('AuthError', {
  message: 'User can not be authenticated.',
});

export const NoValidUserError = createError('NoValidUserError', {
  message: 'No valid user found. Can not complete request.',
});

export const InvalidTokenError = createError('InavlidTokenError', {
  message: 'Invalid Token.',
});

export const InsufficientPermissionsError = createError('InsufficientPermissionsError', {
  message: 'Insufficient permissions.',
});

export const InsufficientIdFieldsError = createError('InsufficientIdFieldsError', {
  message: 'You did not pass the correct identification fields to this operation.',
});
