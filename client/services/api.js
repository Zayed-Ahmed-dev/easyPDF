import axios from "axios";

export const api = axios.create({
    baseURL: 'http://localhost:8000', // <-- points to your Express backend
});
