import { Post } from "../ApisCall/ApiClient";  
import { downloadVideosBaseUrl } from "../ApisCall/Urls";

const baseURL = downloadVideosBaseUrl();

export async function DawnloadVideo(payload) {
  try {
    const response = await Post(`${baseURL}`,payload);
    return response; 
  } catch (error) {
    console.error("Failed to download video:", error);
    throw error;
  }
}



