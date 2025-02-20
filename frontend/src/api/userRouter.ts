import axios from "axios";

const API_ROUTE_PREFIX = "http://localhost/api/auth";

export function registerRoute(
  login: string,
  pass: string,
  errorCallback: () => void,
) {
  return axios
    .post(
      API_ROUTE_PREFIX + "/register",
      {
        username: login,
        password: pass,
      },
      {
        withCredentials: true,
      },
    )
    .catch((e) => {
      handle_error(e, 409, errorCallback);
    });
}

export function loginRoute(
  login: string,
  pass: string,
  errorCallback: () => void,
) {
  return axios
    .post(
      API_ROUTE_PREFIX + "/login",
      {
        username: login,
        password: pass,
      },
      {
        withCredentials: true,
      },
    )
    .catch((e) => {
      handle_error(e, 401, errorCallback);
    });
}

export function save_token(token: string) {
  localStorage.setItem("access_token", token);
}

export function get_token() {
  return localStorage.getItem("access_token") || "";
}

export function clear_token() {
  localStorage.removeItem("access_token");
}

export function getUserInfo(errorCallback: () => void) {
  return axios
    .get(API_ROUTE_PREFIX + "/users/me", {
      withCredentials: true,
      headers: { Authorization: "Bearer " + get_token() },
    })
    .catch((e) => {
      handle_error(e, 401, errorCallback);
    });
}

export function handle_error(e: unknown, code: number, callback: () => void) {
  if (axios.isAxiosError(e)) {
    if (e.status === code) {
      callback();
    }
  } else {
    console.log(e);
  }
}
