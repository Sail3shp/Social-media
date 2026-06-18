import axios from "axios";

export const api = axios.create({
    baseURL: 'https://social-media-tosd.onrender.com/',
    withCredentials: true
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.set("Authorization", `Bearer ${token}`);
  }
  return config;
});