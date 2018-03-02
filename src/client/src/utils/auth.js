import decode from 'jwt-decode';

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
