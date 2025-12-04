import { Post } from "../ApisCall/ApiClient";
import { GetLoginUrl } from "../ApisCall/Urls";

export async function loginUser(username, password) {
  const body = { username, password };

  try {
    const response = await Post(GetLoginUrl(), body);

    const data = response.data;

    if (data.token) {
      localStorage.setItem("token", data.token);
    }

    return data; 
  } catch (error) {
    console.error("Login failed:", error.response?.data || error.message);
    throw error;
  }
}
