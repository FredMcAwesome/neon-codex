import {
  getThreadListAPI,
  postLoginAPI,
  getLoginStatusAPI,
  getWeaponListAPI,
  getGearListAPI,
} from "@shadowrun/common";
import { SERVER } from "./config.js";

const getThreadList = SERVER + getThreadListAPI;
const postLogin = SERVER + postLoginAPI;
const getLoginStatus = SERVER + getLoginStatusAPI;
const getWeaponList = SERVER + getWeaponListAPI;
const getGearList = SERVER + getGearListAPI;

export { getThreadList, getLoginStatus, postLogin, getWeaponList, getGearList };
