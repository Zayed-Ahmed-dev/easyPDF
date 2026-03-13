import axios from "axios";
require('dotenv').config();
const URL = process.env.URL;

export const api = axios.create({
    baseURL: URL, 
});
