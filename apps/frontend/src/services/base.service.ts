import axios from "axios";
import { authCookie } from "@/lib/cookies";

export const backendClient = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

backendClient.interceptors.request.use((config) => {
    const token = authCookie.getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

backendClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            authCookie.clearToken();
        }
        return Promise.reject(error);
    }
);