export interface PlanPrice {
  total: number;
}

export interface PlanPricing {
  [duration: string]: PlanPrice;
}

export interface PlanData {
  _id?: string;
  name: string;
  description: string;
  maxStores: number;
  features: string[];
  durations: number[];
  pricing: PlanPricing;
  isRecommended: boolean;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdatePlanPayload {
  planId: string;
  data: PlanData;
}

export interface PlanResponse {
  success: boolean;
  data: PlanData[];
  message?: string;
}

export interface EditPlanResponse {
  success: boolean;
  data: PlanData;
  message?: string;
}

export interface PlanState {
  loading: boolean;
  editLoading?: boolean;
  error: string | null;
  success: boolean;
  data: PlanData[] | null;
}

