import axios from "axios";
import { API_URL, COOKIES, HttpStatusCodes, TIME_OUT_API, TOKEN } from "./constants";

const getHeaders = () => {
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    "X-Access-Token": TOKEN,
  };

  return headers;
};

export const ApiClient = axios.create({
  baseURL: API_URL,
  timeout: TIME_OUT_API,
  headers: getHeaders(),
  validateStatus: (status: number) =>
    status >= HttpStatusCodes.OK && status < HttpStatusCodes.BAD_REQUEST,
});

// ping backend server
ApiClient("/")
  .then(({ data }) => console.log(data))
  .catch(err => console.log(err))

if (location.pathname === "/") {
  ApiClient("/verify/auth")
    .then(({ data }) => console.log(data))
    .catch(err => {
      COOKIES.remove("investigator_token", { path: "/", sameSite: true, secure: true })
      COOKIES.remove("investigator_info", { path: "/", sameSite: true, secure: true })
      window.location.replace("/signin")
    })
}