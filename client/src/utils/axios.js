import axios from "axios";

export const axiosInstance = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "http://localhost:4000/api/v1"
      : "/api/v1",
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response && err.response.status === 401) {
      window.location.href = "/login"; // redirect globally
    }
    return Promise.reject(err);
  }
);
