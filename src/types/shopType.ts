export interface createShopData {
  name: string;
  email?: string;
  address: {
    street: string;
    city: string;
    state: string;
    pincode: string;
  },
  phone?: string;
  gst?: string;
}

export interface ShopInitialState {
  loading: boolean;
  error: string | null;
  success: boolean;
  shop: createShopData[]
}

export interface ResponseData {
  status: number | string;
  data: any
  message?: string;
}

export interface updateShopData {
  id: string;
  data: createShopData
}