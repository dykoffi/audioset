import { Cookies } from "react-cookie";

export const TIME_OUT_API = 30000;
export const API_URL = "https://audiosetapi-m3okm5mmqa-od.a.run.app";
export const COOKIES = new Cookies();
export const TOKEN: any = COOKIES.get("investigator_token") || "";

export enum HttpStatusCodes {
  All = 0,
  OK = 200,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
  BAD_GATEWAY = 502,
  SERVICE_UNAVAILABLE = 503,
}
