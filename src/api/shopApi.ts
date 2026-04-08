import axiosInstance from "./axiosInstance";

export const createShopApi = (data: any) => {
  return axiosInstance?.post("/stores/", data)
}

export const getShopApi = () => {
  return axiosInstance?.get("/stores/")
}

export const getShopByIdApi = (id: number) => {
  return axiosInstance?.get(`/stores/${id}/`)
}

export const getShopByOwnerApi = (ownerId: string) => {
  return axiosInstance?.get(`/stores/owner/${ownerId}/`)
}

export const updateshopApi = (id: string, data: any) => {
  return axiosInstance?.put(`/stores/${id}/`, data)
}