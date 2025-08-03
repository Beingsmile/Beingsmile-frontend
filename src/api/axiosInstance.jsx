import axios from "axios";


const axiosInstance = axios.create(
    {
        baseURL: "https://api.beingsmile.org/api/", 
        withCredentials: true,
        headers: {
            "Content-Type": "application/json",
        },
    }
)

export default axiosInstance;