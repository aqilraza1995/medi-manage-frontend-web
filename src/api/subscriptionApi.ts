import { CreateSubscrptionPayload } from "@/types/subscriptionType";
import axiosInstance from "./axiosInstance";

export const createSubscriptionApi = (payload: CreateSubscrptionPayload) => {
  return axiosInstance?.post("/subscription/activate", payload)
}

export const getSubscriptionApi = () => {
  return axiosInstance.get("/subscription")
}