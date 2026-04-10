export interface CreateSubscrptionPayload {
    planId: string;
    duration: number;
}

interface subscriptionData{
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

export interface CreateSubscriptionResponse {
  success: boolean;
  data: subscriptionData;
  message?: string; 
}

export interface SubscriptionState {
  loading: boolean;
  error: string | null;
  success: boolean;
  data: subscriptionData[] | null;
}