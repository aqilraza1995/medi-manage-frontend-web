import axiosInstance from "./axiosInstance";

export const getAllActivePlansApi = ()=>{
    return axiosInstance.get("/plan");
}