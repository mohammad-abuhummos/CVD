import { GET } from "../ApisCall/ApiClient";
import { YardsCamerasBaseUrl } from "../ApisCall/Urls";
import axios from "axios";

const baseURL = YardsCamerasBaseUrl();

export async function getCameraById(id) {
  const token = localStorage.getItem("token");
  const res = await GET(`${baseURL}/${id}`, {
    headers: { "Authorization": `Bearer ${token}` }
  });
  if (!res.ok) throw new Error(`Status: ${res.status}`);
  return res.json();
}

