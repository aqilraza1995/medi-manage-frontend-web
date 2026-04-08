import axiosInstance from "./axiosInstance";

export const updateUserApi = (id: string, data: any) => {
  return axiosInstance?.put(`/user/${id}/`, data)
}