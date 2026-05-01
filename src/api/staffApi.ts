import axiosInstance from "./axiosInstance";

export const createStaffApi = (data: any) => {
  return axiosInstance.post("/staff", data)
}

export const getAllStaffApi = () => {
  return axiosInstance.get("/staff")
}

export const getStaffByOwnerApi = (ownerId: string) => {
  return axiosInstance.post(`/staff/${ownerId}`)
}

export const updateStaff = (id: string, data: any) => {
  return axiosInstance.put(`/staff/${id}`, data)
}

export const deleteStaff = (id: string) => {
  return axiosInstance.delete(`/staff/${id}`)
}