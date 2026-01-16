import axios from "axios";
import { getToken, clearToken } from "../utils/auth";

const api = axios.create({
    baseURL: "http://localhost:8080/api",
});

api.interceptors.request.use(
    (config) => {
        const token = getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }else{
            delete config.headers.Authorization;
        }
        return config;
    });

api.interceptors.response.use(
    (res) => res,
    (error) => {
        if (error.response?.status === 401 || error.response?.status === 403) {
            clearToken();
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

export default api;

// safety net