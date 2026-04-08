import axiosInstance from "./axiosInstance";

export const regiterAPI = (data: any) => {
  return axiosInstance?.post("/auth/register/", data)
}

export const loginAPI = (data: any) => {
  return axiosInstance?.post("/auth/login/", data)
}