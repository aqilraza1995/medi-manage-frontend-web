
export interface createStaffData {
  id?:string;
  name: string;
  email?: string;
  phone:string
  address: {
    street: string;
    city: string;
    state: string;
    pincode: string;
  },
  shopId: string;
}

interface Owner{
    [type:string]: string;
}

export interface staffData{
   name: string;
  email?: string;
  phone:string;
  ownerId:Owner;
  shopId:Owner;
  status:string;
  createdAt:string;
  address: {
    street: string;
    city: string;
    state: string;
    pincode: string;
  },
  _id:string;
}

export interface GetStaffResponse {
    success: boolean;
    data: staffData[] 
}

export interface GetStaffEditResponse {
    success: boolean;
    data: staffData 
    message?:string;
}

export interface ResponseData {
  status: number | string;
  data: createStaffData
  message?: string;
}

export interface StaffInitialState {
  loading: boolean;
  error: string | null;
  staff: staffData[]
}

export interface updateStaffData {
  id: string;
  data: createStaffData
}