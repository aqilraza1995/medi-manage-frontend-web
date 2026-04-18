import { PlanData } from "@/types/planType";
import axiosInstance from "./axiosInstance";

export const createPlanApi = (data: PlanData) => {
  return axiosInstance.post("/plan", data)
}
export const getAllActivePlansApi = () => {
  return axiosInstance.get("/plan");
}

export const getPlanByIdApi = (planId: string) => {
  return axiosInstance.get(`/plan/${planId}`)
}

export const updatePlanApi = (planId: string, data: PlanData) => {
  return axiosInstance.put(`/plan/${planId}`, data)
}

export const deletePlanApi = (planId: string) => {
  return axiosInstance.delete(`/plan/${planId}`);
}
