import axios from "axios";
import Cookies from "js-cookie";

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

const token = Cookies.get("token");

const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  },
});

export default axiosInstance;
