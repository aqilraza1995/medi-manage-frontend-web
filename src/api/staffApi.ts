import axiosInstance from "./axiosInstance";

export const createStaffApi = (data: any) => {
  return axiosInstance.post("/staff", data)
}

export const getAllStaffApi = () => {
  return axiosInstance.get("/staff")
}

export const getStaffByIdApi = (id: string) => {
  return axiosInstance.get(`/staff/${id}`)
}

export const getStaffByOwnerApi = (ownerId: string) => {
  return axiosInstance.get(`/staff/owner/${ownerId}`)
}

export const getStaffByShopApi = (shopId: string) => {
  return axiosInstance.get(`/staff/shop/${shopId}`)
}

export const updateStaffApi = (id: string, data: any) => {
  return axiosInstance.put(`/staff/${id}`, data)
}

export const deleteStaffApi = (id: string) => {
  return axiosInstance.delete(`/staff/${id}`)
}