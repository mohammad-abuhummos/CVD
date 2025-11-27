import { Post } from "../ApisCall/ApiClient";
import { YardsCamerasBaseUrl } from "../ApisCall/Urls";

const baseURL = YardsCamerasBaseUrl();

export async function createCamera(payload) {
  try {
    console.log("Creating camera with payload:", payload);
    
    const location = typeof payload.location === 'object' 
      ? `${payload.location.x},${payload.location.y}`
      : payload.location;
    
    const response = await Post(
      `${baseURL}/assign?yardId=${payload.yardId}&cameraId=${payload.cameraId}&location=${location}`,
      {} 
    );
    
    return response; 
  } catch (error) {
    console.error("Failed to create camera:", error);
    throw error;
  }
}



