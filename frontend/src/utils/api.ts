import {
  getThreadListAPI,
  postLoginAPI,
  getLoginStatusAPI,
  getWeaponListAPI,
  getGearListAPI,
} from "@shadowrun/common";
import { getSkillListAPI } from "@shadowrun/common/build/api.js";
import { SERVER } from "./config.js";

const getThreadList = SERVER + getThreadListAPI;
const postLogin = SERVER + postLoginAPI;
const getLoginStatus = SERVER + getLoginStatusAPI;
const getWeaponList = SERVER + getWeaponListAPI;
const getGearList = SERVER + getGearListAPI;
const getSkillList = SERVER + getSkillListAPI;

export {
  getThreadList,
  getLoginStatus,
  postLogin,
  getWeaponList,
  getSkillList,
  getGearList,
};
