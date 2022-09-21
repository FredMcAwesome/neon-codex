import {
  getThreadListAPI,
  postLoginAPI,
  getLoginStatusAPI,
} from "@shadowrun/common";
import { SERVER } from "./config.js";

const getThreadList = SERVER + getThreadListAPI;
const postLogin = SERVER + postLoginAPI;
const getLoginStatus = SERVER + getLoginStatusAPI;

export { getThreadList, getLoginStatus, postLogin };
