import axios from "axios";
import { GetBaseUrl } from "./Urls";

export const api = axios.create({
  baseURL: GetBaseUrl(),
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// POST with Bearer token from localStorage
export async function Post(uri, body) {
  try {
    const token = localStorage.getItem("token"); // replace "token" with your key
    const config = token
      ? { headers: { Authorization: `Bearer ${token}` } }
      : {};

    const response = await api.post(uri, body, config);
    return response.data;
  } catch (error) {
    console.error("Create failed:", error.response?.data || error.message);
    throw error;
  }
}


// PUT
export async function PUT(uri, body) {
  try {
    const response = await api.put(uri, body);
    return response.data;
  } catch (error) {
    console.error("Create failed:", error.response?.data || error.message);
    throw error;
  }
}

export async function DELETE(uri) {
  try {
    const response = await api.delete(uri);
    return response.data;
  } catch (error) {
    console.error("Delete failed:", error.response?.data || error.message);
    throw error;
  }
}

// GET with optional Bearer token
export async function GET(uri, token = null) {
  try {
    const config = token
      ? { headers: { Authorization: `Bearer ${token}` } }
      : {};

    const response = await api.get(uri, config);
    return response.data;
  } catch (error) {
    console.error("GET failed:", error.response?.data || error.message);
    throw error;
  }
}


// UPDATE
export const updateItem = async (endpoint, id, data) => {
  try {
    const response = await api.put(`${endpoint}/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("Update failed:", error.response || error.message);
    throw error;
  }
};

// DELETE
export const deleteItem = async (endpoint, id) => {
  try {
    const response = await api.delete(`${endpoint}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Delete failed:", error.response || error.message);
    throw error;
  }
};
