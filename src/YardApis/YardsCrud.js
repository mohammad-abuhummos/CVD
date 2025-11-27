import { DELETE, GET, Post, PUT } from "../ApisCall/ApiClient";  
import { YardsBaseUrl } from "../ApisCall/Urls"; 


class Yard {
  constructor(id, width, height, name, description, status, yardCameras = []) {
    this.id = id;
    this.width = width;
    this.height = height; 
    this.name = name;
    this.description = description;
    this.status = status;
    this.cameras = yardCameras;
  }
}

const baseURL = "Yard";

export async function getYards() {
  try {
    const response = await GET(YardsBaseUrl(), localStorage.getItem("token"));
    
    const yardsList = response.map(yardData => new Yard(
      yardData.id,
      yardData.width,
      yardData.height,
      yardData.name,
      yardData.description,
      yardData.status,
      yardData.yardCameras
    ));

    return yardsList;
  } catch (error) {
    console.error("Failed to fetch yards:", error);
    throw error;
  }
}


//GET by ID
export async function getYardById(id) {
  try {
    const response = await GET(`${baseURL}/${id}`);
    console.log(response)
    return response; 
  } catch (error) {
    console.error("Failed to fetch yard by ID:", error);
    throw error;
  }
}

//Post  
export async function createYard(payload) {
  console.log("Payload in createYard:", payload);
  try {
    const response = await Post(baseURL, payload);
    return response; 
  } catch (error) {
    console.error("Failed to fetch yard:", error);
    throw error;
  }
}

//Update  
export async function updateYard(id,payload) {
  try {
    const response = await PUT(`${baseURL}/${id}`, payload);
    return response; 
  } catch (error) {
    console.error("Failed to fetch yard by ID:", error);
    throw error;
  }
}
//Delete  
export async function DeleteYard(id) {
  try {
    const response = await DELETE(`${baseURL}/${id}`);
    return response;
  } catch (error) {
    console.error("Failed to fetch yard by ID:", error);
    throw error;
  }
}



