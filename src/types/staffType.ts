export interface createStaffData {
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

export interface ResponseData {
  status: number | string;
  data: createStaffData
  message?: string;
}

export interface StaffInitialState {
  loading: boolean;
  error: string | null;
  staff: createStaffData[]
}