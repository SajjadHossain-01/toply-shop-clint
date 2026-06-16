"use client"

import { useAuth } from "@/context/auth-context";
import axios from "axios";
import { useRouter } from "next/navigation";

const axiosSecure = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

const useAxiosSecure = () => {
  const router = useRouter();
  const { logout } = useAuth();

  axiosSecure.interceptors.request.use(
    function (config) {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.authorization = `Bearer ${token}`;
      }
      return config;
    },
    function (error) {
      return Promise.reject(error);
    }
  );

  axiosSecure.interceptors.response.use(
    function (response) {
      return response;
    },
    async (error) => {
      const status = error?.response?.status;
      
      if (status === 401) {
        await logout();
        router.push("/login");
      }
      
      if (status === 403) {   
        console.warn("Access Forbidden: You don't have permission.");
      }
      
      return Promise.reject(error);
    }
  );

  return axiosSecure;
};

export default useAxiosSecure;