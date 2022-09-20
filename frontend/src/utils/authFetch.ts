import {
  clearUserSession,
  getUserSession,
} from "../components/login/loginHelper.js";
import { SERVER } from "./config.js";

export { useFetchWrapper };

function useFetchWrapper() {
  return {
    get: request("GET"),
    post: request("POST"),
    put: request("PUT"),
    delete: request("DELETE"),
  };

  function request(method: string) {
    return (url: string, body?: BodyInit) => {
      const requestOptions: RequestInit = {
        mode: "cors",
        method: method,
        headers: authHeader(url),
      };
      if (body) {
        requestOptions.body = body;
      }
      return fetch(url, requestOptions).then(handleResponse);
    };
  }

  // helper functions

  function isLoggedIn() {
    const { token } = getUserSession();
    if (!token || token.length == 0) {
      return false;
    }
    return true;
  }

  function getToken() {
    const { token } = getUserSession();
    return token;
  }

  function authHeader(url: string) {
    // return auth header with jwt if user is logged in and request is to the api url
    const token = getToken();
    const loggedIn = isLoggedIn();
    const isApiUrl = url.startsWith(SERVER);
    if (loggedIn && isApiUrl) {
      return { Authorization: `Bearer ${token}` };
    } else {
      return undefined;
    }
  }

  function handleResponse(response: Response) {
    if (!response.ok) {
      if ([401, 403].includes(response.status) && isLoggedIn()) {
        // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
        clearUserSession();
      }
    }
    return response;
  }
}
