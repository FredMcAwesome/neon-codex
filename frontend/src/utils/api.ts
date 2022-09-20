import { SERVER } from "./config.js";
import {
  getThreadListAPI,
  postLoginAPI,
  getLoginStatusAPI,
} from "@shadowrun/common";

const getThreadList = SERVER + getThreadListAPI;
const postLogin = SERVER + postLoginAPI;
const getLoginStatus = SERVER + getLoginStatusAPI;

export { getThreadList, getLoginStatus, postLogin };
