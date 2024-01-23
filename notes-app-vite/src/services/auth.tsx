import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { JwtPayload } from "../types";

export function getUserName() {
  const jwt = localStorage.getItem("jwt");
  if (!jwt) return "";
  const decodedToken: JwtPayload = jwtDecode(jwt);
  return decodedToken.username;
}

export async function registerUser(username: string, password: string) {
  try {
    const response = await axios.post("http://localhost:8080/register-user", {
      username,
      password,
    });
    return { data: response.data, error: null };
  } catch (error: any) {
    // bad request from client
    if (
      error.response &&
      (error.response.status === 400 || error.response.status === 429)
    ) {
      return { data: null, error: error.response.data };
    } else {
      console.error("An unexpected error occurred:", error);
      return { data: null, error: "An unexpected error occurred" };
    }
  }
}

export async function loginUser(username: string, password: string) {
  try {
    const response = await axios.post("http://localhost:8080/login", {
      username,
      password,
    });
    return { data: response.data, error: null };
  } catch (error: any) {
    // bad request from client
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 429)
    ) {
      return { data: null, error: error.response.data };
    } else {
      console.error("An unexpected error occurred:", error);
      return { data: null, error: "An unexpected error occurred" };
    }
  }
}
