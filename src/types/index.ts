
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  rating: number;
  reviewCount: number;
  image: string;
  thumbnails: string[];
  inStock: boolean;
  featured?: boolean;
  deal?: boolean;
  specifications: Record<string, string>;
}

export interface Category {
  id: string;
  name: string;
  image: string;
  slug: string;
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  phoneNumber?: string;
  addresses: Address[];
}

export interface Address {
  id: string;
  type: 'home' | 'work' | 'other';
  name: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  isDefault: boolean;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  totalAmount: number;
  status: 'pending' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: any;
  shippingAddress: Address;
}
