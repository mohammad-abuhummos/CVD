import { GET } from "../ApisCall/ApiClient";
import { CamerasBaseUrl } from "../ApisCall/Urls";

const baseURL = CamerasBaseUrl();

export async function getCamera() {
  try {
    const response = await GET(`${baseURL}`);
    return response; 
  } catch (error) {
    console.error("Failed to fetch camera:", error);
    throw error;
  }
}