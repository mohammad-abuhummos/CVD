// Auth.js
import { Post } from "../ApisCall/ApiClient";
import { GetLoginUrl } from "../ApisCall/Urls";

export async function loginUser(username, password) {
  const body = { username, password };

  try {
    const response = await Post(GetLoginUrl(), body);
    
    // Save token to localStorage directly
    if (response.token) {
      localStorage.setItem("token", response.token);
    }

    return response;
  } catch (error) {
    console.error("Login failed:", error.response?.data || error.message);
    throw error;
  }
}
