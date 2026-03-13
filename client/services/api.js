import axios from "axios";

const URL = import.meta.env.VITE_API_URL; // ✅ correct way in Vite

export const api = axios.create({
    baseURL: URL, 
});