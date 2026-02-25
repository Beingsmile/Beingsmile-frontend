import axios from "axios";


const axiosInstance = axios.create(
    {
        baseURL: "https://api.beingsmile.org/api/",
        // baseURL: "http://localhost:5000/api/",
        withCredentials: true,
        headers: {
            "Content-Type": "application/json",
        },
    }
)

export default axiosInstance;