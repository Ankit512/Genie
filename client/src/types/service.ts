export interface Service {
  id: string;
  providerId: string;
  title: string;
  description: string;
  category: ServiceCategory;
  price: {
    amount: number;
    unit: 'hour' | 'job';
  };
  availability: {
    days: string[]; // ['monday', 'tuesday', etc.]
    startTime: string; // HH:mm format
    endTime: string; // HH:mm format
  };
  location: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  images: string[]; // URLs to service images
  rating?: number;
  reviewCount?: number;
  createdAt: string;
  updatedAt: string;
}

export type ServiceCategory =
  | 'cleaning'
  | 'plumbing'
  | 'electrical'
  | 'landscaping'
  | 'painting'
  | 'carpentry'
  | 'appliance_repair'
  | 'hvac'
  | 'pest_control'
  | 'moving'
  | 'other';

export interface ServiceFormData extends Omit<Service, 'id' | 'providerId' | 'rating' | 'reviewCount' | 'createdAt' | 'updatedAt'> {} 