import { useEffect } from "react";
import useAuth from "./useAuth";
import { useNavigate } from 'react-router-dom'
import axios from "axios";

export const axiosSecure = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    withCredentials: true,
})

const useAxiosSecure = () => {
    const {logout} = useAuth()
    const navigate = useNavigate()


    useEffect(() => {
        axiosSecure.interceptors.response.use((response) => {
            return response;
        },
        async (error) => {
            console.log("Error tracked in the interceptor", error.response);
            
            if(error.response.status === 401 || error.response.status === 403) {
                await logout();
                navigate("/login")
            }
            return Promise.reject(error)
        }
    )
    }, [logout, navigate])



    return axiosSecure;
};

export default useAxiosSecure;