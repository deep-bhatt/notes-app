import axios from "axios";

export async function registerUser(username: string, password: string) {
  try {
    const response = await axios.post("http://localhost:8080/register-user", {
      username,
      password,
    });
    return { data: response.data, error: null };
  } catch (error: any) {
    // bad request from client
    if (error.response && error.response.status === 400) {
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
    if (error.response && error.response.status === 401) {
      return { data: null, error: error.response.data };
    } else {
      console.error("An unexpected error occurred:", error);
      return { data: null, error: "An unexpected error occurred" };
    }
  }
}