import {
  getGearListAPI,
  getLoginStatusAPI,
  getSkillListAPI,
  getThreadListAPI,
  getWeaponListAPI,
  postLoginAPI,
} from "@neon-codex/common/build/api.js";
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
