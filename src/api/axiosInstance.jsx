import axios from "axios";


const axioInstance = axios.create(
    {
        baseURL: import.meta.env.REACT_APP_API_URL || "http://localhost:5000/api",
        withCredentials: true,
        headers: {
            "Content-Type": "application/json",
        },
    }
)

export default axioInstance;