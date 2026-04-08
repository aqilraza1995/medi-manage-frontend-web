export interface RegisterPayload {
  name?: string;
  phone?: string;
  email?: string;
  password?: string;
  confirmPassword?: string
  onboardingCompleted?: boolean;
  activeSubscription?: string | null;
  stores?: string[]
  
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthState {
  loading: boolean;
  error: string | null;
  success: boolean;
  user: any
}

export interface registerResponse {
  data: {
    token: string;
    user: RegisterPayload
  },
  message: string
}

export interface ResponseData {
  status: number | string;
  data: registerResponse
  message?: string;
}

export interface UpdateUserResponseData {
  status: number | string;
  data: RegisterPayload
  message?: string;
}

interface StateOption {
  name: string;
  isoCode: string;
  [key: string]: string | number | boolean; // Add index signature for CustomSelect
}

interface CityOption {
  name: string;
  [key: string]: string | number | boolean; // Add index signature for CustomSelect
}

export interface LocationState {
  states: StateOption[];
  cities: CityOption[];
}

export interface UpdateUserPayload {
  id: string;
  data: RegisterPayload;
}