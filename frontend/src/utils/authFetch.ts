import {
  clearUserSession,
  getUserSession,
} from "../components/login/loginHelper.js";

// helper functions

export function isLoggedIn() {
  const { token } = getUserSession();
  if (!token || token.length == 0) {
    return false;
  }
  return true;
}

export function getToken() {
  const { token } = getUserSession();
  return token;
}

export function getAuthHeader() {
  // return auth header with jwt if user is logged in and request is to the api url
  const token = getToken();
  const loggedIn = isLoggedIn();
  if (loggedIn) {
    return `Bearer ${token}`;
  } else {
    return undefined;
  }
}

export function handleResponse(response: Response) {
  if (!response.ok) {
    if ([401, 403].includes(response.status) && isLoggedIn()) {
      // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
      clearUserSession();
    }
  }
  return response;
}
