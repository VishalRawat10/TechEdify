import axios from "axios";

export const apiInstance = axios.create({
    baseURL: `${import.meta.env.VITE_SERVER_URL}`,
    withCredentials: true
});
