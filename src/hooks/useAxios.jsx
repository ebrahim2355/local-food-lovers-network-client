import axios from "axios";

const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL ||
    "https://local-food-lovers-network-server.vercel.app";

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
});

const useAxios = () => {
    return axiosInstance;
};

export default useAxios;
