import decode from 'jwt-decode';
import { keys, has } from 'lodash';

export const setToken = idToken => localStorage.setItem('token', idToken);

export const getToken = () => localStorage.getItem('token');

export const logout = () => localStorage.removeItem('token');

export const doesTokenExist = token => {
  return token ? true : false;
};

export const isTokenExpired = token => {
  try {
    const decoded = decode(token);
    if (decoded.exp < Date.now() / 1000) {
      return true;
    }
    return false;
  } catch (err) {
    return false;
  }
};

export const isLoggedIn = () => {
  const token = getToken();
  return doesTokenExist(token) && !isTokenExpired(token);
};

export const extractOrgs = () => {
  const token = getToken();
  const decoded = decode(token);
  return keys(decoded.permissions);
};

export const hasOrgAccess = orgId => {
  const token = getToken();
  const decoded = decode(token);
  return has(decoded.permissions, orgId);
};
