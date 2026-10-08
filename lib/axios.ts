import axios, { AxiosError } from "axios";
import { normalizeAxiosError } from "./api-error";

export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL ?? "",
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json'
    }
});

api.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => Promise.reject(normalizeAxiosError(error))
);