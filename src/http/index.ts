import { FINNHUB_API_KEY, FINNHUB_API_URL } from "@env";
import axios from "axios";

const http = axios.create({
    baseURL: FINNHUB_API_URL,
});

http.interceptors.request.use((config) => {
    const separator = config.url?.includes('?') ? '&' : '?';
    config.url = `${config.url}${separator}token=${FINNHUB_API_KEY}`;
    return config;
});

export default http;