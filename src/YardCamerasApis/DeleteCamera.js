import { DELETE } from "../ApisCall/ApiClient";  
import { YardsCamerasBaseUrl } from "../ApisCall/Urls";

const baseURL = YardsCamerasBaseUrl();

export async function DeleteYardCamera(id,payload) {
  console.log(id , payload)
  try {
    const response = await DELETE(`${baseURL}/unassign?yardId=${id}&cameraId=${payload}`, payload);
    console.log( response);
    console.log( `payload =${payload}`)
    return response; 
  } catch (error) {
    console.error("Failed to fetch yard by ID:", error);
    throw error;
  }
}
