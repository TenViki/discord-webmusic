import axios from "axios";
export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const server = axios.create({
  baseURL: BACKEND_URL,
});
