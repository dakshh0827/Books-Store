import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.MODE === "development" 
    ? "http://localhost:5001/api" 
    : "https://your-backend-url.onrender.com/api", // Replace with your actual backend URL
  withCredentials: true,
});
