import axios from "axios";


const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
const baseURL = apiUrl.endsWith('/api/') ? apiUrl : apiUrl.endsWith('/api') ? apiUrl + '/' : `${apiUrl}/api/`;

const axiosInstance = axios.create(
    {
        baseURL: baseURL,
        withCredentials: true,
        headers: {
            "Content-Type": "application/json",
        },
    }
)

export default axiosInstance;