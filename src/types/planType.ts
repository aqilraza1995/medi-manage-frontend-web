export interface PlanPrice {
  total: number;
}

export interface PlanPricing {
  [duration: string]: PlanPrice;
}

export interface PlanData {
  _id: string;
  name: string;
  description: string;
  maxStores: number;
  features: string[];
  durations: number[];
  pricing: PlanPricing;
  isRecommended: boolean;
  isActive: boolean;
  createdAt?: string; 
  updatedAt: string;    
}

export interface PlanResponse {
  success: boolean;
  data: PlanData[];
  message?: string; 
}

export interface PlanState {
  loading: boolean;
  error: string | null;
  success: boolean;
  data: PlanData[] | null;
}

