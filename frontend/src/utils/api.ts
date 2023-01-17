import {
  getThreadListAPI,
  postLoginAPI,
  getLoginStatusAPI,
  getWeaponListAPI,
} from "@shadowrun/common";
import { SERVER } from "./config.js";

const getThreadList = SERVER + getThreadListAPI;
const postLogin = SERVER + postLoginAPI;
const getLoginStatus = SERVER + getLoginStatusAPI;
const getWeaponList = SERVER + getWeaponListAPI;

export { getThreadList, getLoginStatus, postLogin, getWeaponList };
