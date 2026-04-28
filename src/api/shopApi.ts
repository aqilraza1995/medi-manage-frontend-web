import { createShopData } from "@/types/shopType";
import axiosInstance from "./axiosInstance";

export const createShopApi = (data: createShopData) => {
  return axiosInstance?.post("/stores/", data)
}

export const getShopApi = () => {
  return axiosInstance?.get("/stores/")
}

export const getShopByIdApi = (id: string) => {
  return axiosInstance?.get(`/stores/${id}/`)
}

export const getShopByOwnerApi = (ownerId: string) => {
  return axiosInstance?.get(`/stores/owner/${ownerId}/`)
}

export const updateshopApi = (id: string, data: createShopData) => {
  return axiosInstance?.put(`/stores/${id}/`, data)
}

export const deleteShopApi = (id: string) => {
  return axiosInstance?.delete(`/stores/${id}/`)
}