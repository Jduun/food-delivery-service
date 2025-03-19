import axios from "axios";
import { NavigateFunction } from "react-router";

export const API_AUTH_ROUTE_PREFIX = "http://localhost/api/auth";

export function useUserRoutes(navigate: NavigateFunction) {
  function registerRoute(
    login: string,
    pass: string,
    errorCallback?: () => void,
  ) {
    return axios
      .post(
        API_AUTH_ROUTE_PREFIX + "/register",
        { username: login, password: pass },
        { withCredentials: true },
      )
      .catch((e) => handleError(e, 409, errorCallback));
  }

  function getToken() {
    return localStorage.getItem("access_token") || "";
  }

  function saveToken(token: string) {
    localStorage.setItem("access_token", token);

    navigate("/profile");
  }

  function clearToken() {
    localStorage.removeItem("access_token");
    navigate("/login");
  }

  function loginRoute(login: string, pass: string, errorCallback?: () => void) {
    return axios
      .post(
        API_AUTH_ROUTE_PREFIX + "/login",
        { username: login, password: pass },
        { withCredentials: true },
      )
      .catch((e) => handleError(e, 401, errorCallback));
  }

  function getUserInfo() {
    return axios
      .get(API_AUTH_ROUTE_PREFIX + "/users/me", {
        withCredentials: true,
        headers: { Authorization: "Bearer " + getToken() },
      })
      .catch((e) => handleError(e, 401));
  }

  function handleError(e: unknown, code?: number, errorCallback?: () => void) {
    if (axios.isAxiosError(e)) {
      if (code) {
        if (e.response?.status === code) {
          if (errorCallback) {
            errorCallback();
          }
        }
      }
      if (e.response?.status === 401) {
        navigate("/login");
      }
    } else {
      console.log(e);
    }
  }

  return {
    registerRoute,
    loginRoute,
    getUserInfo,
    handleError,
    getToken,
    clearToken,
    saveToken,
  };
}
