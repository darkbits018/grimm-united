export interface ProductVariant {
  id: string;
  color_name: string;
  image: string;
  images: string[];
  sizes: string[];
  stock_per_size: Record<string, number>;
  qikink_color_id: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  compare_at_price?: number;
  images: string[];
  sizes: string[];
  stock_per_size: Record<string, number>;
  category: string;
  tags: string[];
  is_active: boolean;
  variants?: ProductVariant[];
  qikink_client_product_id?: string;
  qikink_color_id?: string;
  qikink_print_type_id?: number;
  qikink_sku?: string;
  qikink_design_code?: string;
}

export interface CartItem {
  product: Product;
  size: string;
  quantity: number;
}

export interface ShippingAddress {
  name: string;
  email: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  shipping_address: ShippingAddress;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  created_at: string;
  coupon_code?: string;
}
