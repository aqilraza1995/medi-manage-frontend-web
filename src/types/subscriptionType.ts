export interface CreateSubscrptionPayload {
    planId: string;
    duration: number;
}

export interface subscriptionData{
    _id?: string;
    userId: string;
    planId: string;
    startDate: string;
    endDate: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    isTrial: boolean;
    duration: number;
    planSnapshot: {
        name: string;
        duration: Number;
        price: Number;
        storeLimit: Number;
    };
}

export interface PopulateSubscriptionData{
   _id?: string;
    userId: {name:string, email:string, phone:string};
    planId: {name:string };
    startDate: string;
    endDate: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    isTrial: boolean;
    duration: number;
    planSnapshot: {
        name: string;
        duration: number;
        price: number;
        storeLimit: number;
    };
}

export interface SubscriptionResponse {
  success: boolean;
  data: subscriptionData;
  message?: string; 
}

export interface GetSubscriptionResponse {
  success: boolean;
  data: subscriptionData[];
  message?: string; 
}

export interface SubscriptionState {
  loading: boolean;
  error: string | null;
  success: boolean;
  data: subscriptionData[] | null;
}