// Session details are only read and written on app startup and login/logout

import { JwtTokenSchema } from "@shadowrun/common/";
import type { JwtTokenType, LoginType } from "@shadowrun/common";
import { postLogin } from "../../utils/api.js";

// otherwise use store values
export const saveUserSession = (token: string, username: string) => {
  localStorage.setItem("token", token);
  localStorage.setItem("username", username);
};

export const getUserSession = () => {
  return {
    token: localStorage.getItem("token"),
    username: localStorage.getItem("username"),
  };
};

export const clearUserSession = () => {
  saveUserSession("", "");
};

interface IUserInfo {
  username: string;
  password: string;
}

export const attemptLogin = async function (userinfo: IUserInfo) {
  if (userinfo.username.trim() == "" || userinfo.password.trim() == "")
    throw new Error("Username and Password must be at least 1 character");

  const loginCredentials: LoginType = {
    username: userinfo.username,
    password: userinfo.password,
  };

  const response = await fetch(postLogin, {
    method: "POST",
    body: new URLSearchParams(loginCredentials),
  });
  if (response.ok) {
    // Use zod to parse the api return data
    // | ResponseLogin isn't needed here but shown to clarify intended result
    const res: unknown | JwtTokenType = await response.json();
    const parsedRes = JwtTokenSchema.safeParse(res);
    if (parsedRes.success) {
      console.log("parsed correctly");
      saveUserSession(parsedRes.data.token, userinfo.username);
      return {
        success: true,
      };
    } else {
      console.error("failed to parse login response");
      throw new Error("invalid response parsing from attemptlogin");
    }
  } else {
    if (response.status == 401) {
      console.warn("invalid credentials");
      throw new Error("invalid credentials");
    } else {
      console.error("invalid response from attemptlogin");
      throw new Error("invalid response from attemptlogin");
    }
  }
};

export const isAuthenticated = async function () {
  const { token } = getUserSession();
  if (!token || token.length == 0) {
    return false;
  }
  // const authHeader = { Authorization: "Bearer " + token };
  // const response = await fetch(getLoginStatus, {
  //   mode: "cors",
  //   headers: authHeader,
  // });
  // if (!response.ok) {
  //   clearUserSession();
  //   return false;
  // }
  return true;
};
